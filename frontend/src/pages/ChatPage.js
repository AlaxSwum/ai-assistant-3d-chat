import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import RobotModel from '../components/RobotModel';
import ReactMarkdown from 'react-markdown';
import config from '../config';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: config.API_URL
});

// Function to clean markdown formatting
const cleanMarkdown = (text) => {
  if (!text) return '';
  
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italics
    .replace(/=+/g, '') // Remove equal signs
    .replace(/^#+\s+(.*)$/gm, '$1') // Remove headers
    .replace(/^-+$/gm, '') // Remove horizontal lines
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Remove inline code and code blocks
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)') // Convert links to text with URL
    .replace(/^\s*[-*+]\s+/gm, '• '); // Convert list items to bullets
};

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isModelAnimating, setIsModelAnimating] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to chat history
    const userMessage = { type: 'user', content: message };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    
    setIsLoading(true);
    setMessage('');
    
    // Get response format preference and user profile from localStorage
    const responseFormat = localStorage.getItem('responseFormat') || 'standard';
    const userName = localStorage.getItem('userName') || '';
    const userRole = localStorage.getItem('userRole') || '';
    const userBio = localStorage.getItem('userBio') || '';
    
    try {
      const response = await api.post('/api/chat', { 
        message,
        responseFormat,
        userName,
        userRole,
        userBio
      });
      
      const aiMessage = { 
        type: 'ai', 
        content: response.data.message,
        audioUrl: response.data.audio_url
      };
      
      setChatHistory([...updatedHistory, aiMessage]);
      
      // Set audio source and animate the model
      if (response.data.audio_url) {
        setAudioSrc(`${config.API_URL}${response.data.audio_url}`);
        setIsModelAnimating(true);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        type: 'ai', 
        content: 'Error: Failed to get response from AI teacher.' 
      };
      setChatHistory([...updatedHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Play audio when source changes
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }, [audioSrc]);

  // Handle audio playback events
  useEffect(() => {
    const audioElement = audioRef.current;
    
    const handleAudioEnd = () => {
      setIsModelAnimating(false);
    };
    
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnd);
    }
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudioToText(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const processAudioToText = async (audioBlob) => {
    setIsLoading(true);
    
    try {
      // Create form data with audio file
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      // Send to speech-to-text API
      const response = await api.post('/api/speech-to-text', formData);
      
      if (response.data.transcript) {
        const transcript = response.data.transcript;
        setMessage(transcript);
        
        // Auto-submit the transcribed message
        const userMessage = { type: 'user', content: transcript };
        const updatedHistory = [...chatHistory, userMessage];
        setChatHistory(updatedHistory);
        
        // Get response format preference from localStorage
        const responseFormat = localStorage.getItem('responseFormat') || 'standard';
        
        try {
          const aiResponse = await api.post('/api/chat', { 
            message: transcript,
            responseFormat 
          });
          
          const aiMessage = { 
            type: 'ai', 
            content: aiResponse.data.message,
            audioUrl: aiResponse.data.audio_url
          };
          
          setChatHistory([...updatedHistory, aiMessage]);
          
          // Set audio source and animate the model
          if (aiResponse.data.audio_url) {
            setAudioSrc(`${config.API_URL}${aiResponse.data.audio_url}`);
            setIsModelAnimating(true);
          }
          
        } catch (error) {
          console.error('Error sending message:', error);
          const errorMessage = { 
            type: 'ai', 
            content: 'Error: Failed to get response from AI teacher.' 
          };
          setChatHistory([...updatedHistory, errorMessage]);
        }
      }
    } catch (error) {
      console.error('Error converting speech to text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <Container>
      <Header>
        <BackButton as={Link} to="/">
          ←
        </BackButton>
        <HeaderTitle>Your Medical AI Assistant</HeaderTitle>
        <OnlineStatus>Online</OnlineStatus>
      </Header>

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} src={audioSrc} />

      {/* Desktop layout structure */}
      <ContentLayout>
        {/* Chat Container */}
        <ChatContainer ref={chatContainerRef}>
          <AnimatePresence>
            {chatHistory.length === 0 ? (
              <EmptyChat>
                <EmptyText>Ask me anything...</EmptyText>
              </EmptyChat>
            ) : (
              chatHistory.map((msg, index) => (
                <MessageBubble
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  $isAI={msg.type === 'ai'}
                >
                  {msg.type === 'ai' ? (
                    <MessageContent>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </MessageContent>
                  ) : (
                    msg.content
                  )}
                </MessageBubble>
              ))
            )}
            {isLoading && (
              <LoadingIndicator
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingDot delay={0} />
                <LoadingDot delay={0.2} />
                <LoadingDot delay={0.4} />
              </LoadingIndicator>
            )}
          </AnimatePresence>
        </ChatContainer>

        {/* Robot Model Container - will be repositioned in CSS based on screen size */}
        <ModelContainer>
          <RobotModel isAnimating={isModelAnimating} />
        </ModelContainer>
      </ContentLayout>

      <InputArea>
        <MessageForm onSubmit={handleSubmit}>
          <MessageInput
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading || isListening}
          />
          <VoiceButton
            type="button"
            onClick={isListening ? stopListening : startListening}
            $isListening={isListening}
          >
            {isListening ? (
              <VoiceWaves>
                <Wave delay={0} />
                <Wave delay={0.2} />
                <Wave delay={0.4} />
                <Wave delay={0.6} />
              </VoiceWaves>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12V7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7V12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 10V12C5 16.4183 8.13401 20 12 20C15.866 20 19 16.4183 19 12V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20V22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </VoiceButton>
          <SendButton
            type="submit"
            disabled={isLoading || !message.trim() || isListening}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SendButton>
        </MessageForm>
      </InputArea>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  background-color: transparent;
  position: relative;

  @media (min-width: 768px) {
    max-width: 700px;
  }

  @media (min-width: 1200px) {
    max-width: 1000px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #222;

  @media (min-width: 768px) {
    padding: 24px 40px;
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (min-width: 768px) {
    font-size: 22px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #c1ff72;

  @media (min-width: 768px) {
    font-size: 22px;
  }
`;

const OnlineStatus = styled.div`
  font-size: 14px;
  color: #aaa;
`;

const ContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  position: relative;
  
  @media (min-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const ModelContainer = styled.div`
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;

  @media (min-width: 768px) {
    height: 250px;
    margin-top: 20px;
    margin-bottom: 0;
    order: 2;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 300px;

  @media (min-width: 768px) {
    padding: 30px 40px;
    gap: 20px;
    flex: 1;
    order: 1;
    height: 400px;
    max-height: 400px;
  }
`;

const EmptyChat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;

  @media (min-width: 768px) {
    padding: 60px 40px;
  }
`;

const EmptyText = styled.p`
  font-size: 18px;
  color: #aaa;
  margin-top: 20px;

  @media (min-width: 768px) {
    font-size: 20px;
    margin-top: 30px;
  }
`;

const MessageBubble = styled(motion.div)`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.5;
  align-self: ${props => props.$isAI ? 'flex-start' : 'flex-end'};
  background-color: ${props => props.$isAI ? '#1a1a1a' : '#4b45a9'};
  color: ${props => props.$isAI ? '#fff' : '#fff'};
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  
  ${props => props.$isAI && `
    border-bottom-left-radius: 4px;
  `}
  
  ${props => !props.$isAI && `
    border-bottom-right-radius: 4px;
  `}

  @media (min-width: 768px) {
    max-width: 70%;
    padding: 16px 20px;
    font-size: 16px;
    line-height: 1.6;
  }
`;

const MessageContent = styled.div`
  a {
    color: #5472d3;
    text-decoration: underline;
  }
  
  p {
    margin-bottom: 0.8em;
  }
  
  ul, ol {
    margin-left: 1.5em;
    margin-bottom: 0.8em;
  }

  h2 {
    font-size: 1.4em;
    font-weight: 600;
    margin-top: 1.2em;
    margin-bottom: 0.6em;
    color: #c1ff72;
  }

  h3 {
    font-size: 1.2em;
    font-weight: 600;
    margin-top: 1em;
    margin-bottom: 0.5em;
    color: #b28dff;
  }

  li {
    margin-bottom: 0.3em;
  }

  code {
    background-color: #333;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }
`;

const LoadingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  background-color: #1a1a1a;
  border-radius: 18px;
  align-self: flex-start;
  margin-top: 10px;
`;

const LoadingDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #aaa;
  animation: bounce 1.4s infinite ease-in-out both;
  animation-delay: ${props => props.delay}s;
  
  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const InputArea = styled.div`
  padding: 16px;
  border-top: 1px solid #222;

  @media (min-width: 768px) {
    padding: 24px 40px;
  }
`;

const MessageForm = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 14px;
  border-radius: 24px;
  border: 1px solid #333;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #5472d3;
  }
  
  &::placeholder {
    color: #666;
  }

  @media (min-width: 768px) {
    padding: 16px 20px;
    font-size: 18px;
    border-radius: 30px;
  }
`;

const VoiceButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$isListening ? '#e74c3c' : '#2d2d2d'};
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$isListening ? '#c0392b' : '#3d3d3d'};
  }
  
  ${props => props.$isListening && `
    animation: pulse 1.5s infinite;
  `}
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(231, 76, 60, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
    }
  }

  @media (min-width: 768px) {
    width: 56px;
    height: 56px;
    font-size: 22px;
  }
`;

const VoiceWaves = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  gap: 3px;
`;

const Wave = styled.div`
  width: 3px;
  height: 100%;
  background-color: #fff;
  border-radius: 3px;
  animation: wave 1s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
  
  @keyframes wave {
    0%, 100% {
      height: 6px;
    }
    50% {
      height: 18px;
    }
  }
`;

const SendButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #5472d3;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  
  &:hover {
    background-color: #3f5bb5;
  }
  
  &:disabled {
    background-color: #333;
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (min-width: 768px) {
    width: 56px;
    height: 56px;
    font-size: 22px;
  }
`;

export default ChatPage; 