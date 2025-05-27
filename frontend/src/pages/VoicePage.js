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

const VoicePage = () => {
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [isModelAnimating, setIsModelAnimating] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

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
      // Clear previous responses
      setTranscription('');
      setAIResponse('');
      setShowResponse(false);
      setAudioSrc('');
      
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
        setTranscription(transcript);
        
        // Get response format preference and user profile from localStorage
        const responseFormat = localStorage.getItem('responseFormat') || 'standard';
        const userName = localStorage.getItem('userName') || '';
        const userRole = localStorage.getItem('userRole') || '';
        const userBio = localStorage.getItem('userBio') || '';
        
        try {
          const aiResponse = await api.post('/api/chat', { 
            message: transcript,
            responseFormat,
            userName,
            userRole,
            userBio
          });
          
          setAIResponse(aiResponse.data.message);
          
          // Set audio source and animate the model if audio is available
          if (aiResponse.data.audio_url) {
            setAudioSrc(`${config.API_URL}${aiResponse.data.audio_url}`);
            setIsModelAnimating(true);
          }
          
          setShowResponse(true);
        } catch (error) {
          console.error('Error sending message:', error);
          setAIResponse('Error: Failed to get response from AI teacher.');
          setShowResponse(true);
        }
      }
    } catch (error) {
      console.error('Error converting speech to text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton as={Link} to="/">
          ←
        </BackButton>
        <HeaderTitle>Your Personal AI Assistant</HeaderTitle>
        <OnlineStatus>Online</OnlineStatus>
      </Header>
      
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} src={audioSrc} />

      <MainContent>
        <AnimatePresence mode="wait">
          {!showResponse ? (
            <CentralRobot
              key="robot"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div style={{ width: '100%', height: '300px', marginBottom: '20px' }}>
                <RobotModel isAnimating={isListening} />
              </div>
              
              {transcription && (
                <TranscriptionText
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {transcription}
                </TranscriptionText>
              )}
              
              {isLoading && (
                <LoadingText>
                  <LoadingDot delay={0} />
                  <LoadingDot delay={0.2} />
                  <LoadingDot delay={0.4} />
                </LoadingText>
              )}
            </CentralRobot>
          ) : (
            <ResponseContainer
              key="response"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div style={{ width: '100%', height: '300px', marginBottom: '20px' }}>
                <RobotModel isAnimating={isModelAnimating} />
              </div>
              
              <QueryContainer>
                <QueryLabel>You asked:</QueryLabel>
                <Query>{transcription}</Query>
              </QueryContainer>
              
              <ResponseContent>
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
              </ResponseContent>
              
              <NewQueryButton
                onClick={() => {
                  setShowResponse(false);
                  setTranscription('');
                  setAIResponse('');
                  setAudioSrc('');
                }}
              >
                Ask Another Question
              </NewQueryButton>
            </ResponseContainer>
          )}
        </AnimatePresence>
      </MainContent>

      <ControlsArea>
        {!showResponse && (
          <VoiceButton
            onClick={isListening ? stopListening : startListening}
            $isListening={isListening}
            disabled={isLoading}
          >
            {isListening ? (
              <VoiceWaves>
                <Wave delay={0} />
                <Wave delay={0.2} />
                <Wave delay={0.4} />
                <Wave delay={0.6} />
              </VoiceWaves>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12V7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7V12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 10V12C5 16.4183 8.13401 20 12 20C15.866 20 19 16.4183 19 12V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20V22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </VoiceButton>
        )}
        <InstructionText>
          {isListening 
            ? "Listening... Tap to stop" 
            : showResponse 
              ? "Review your answer above" 
              : "Tap microphone to speak"}
        </InstructionText>
      </ControlsArea>
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

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;

  @media (min-width: 768px) {
    padding: 40px;
  }
`;

const ModelContainer = styled.div`
  width: 100%;
  height: 350px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    height: 400px;
    margin-bottom: 30px;
  }
`;

const CentralRobot = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const TranscriptionText = styled(motion.div)`
  font-size: 18px;
  line-height: 1.5;
  color: #fff;
  text-align: center;
  margin-top: 40px;
  max-width: 90%;

  @media (min-width: 768px) {
    font-size: 22px;
    line-height: 1.6;
    max-width: 80%;
    margin-top: 60px;
  }
`;

const LoadingText = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 30px;
`;

const LoadingDot = styled.div`
  width: 10px;
  height: 10px;
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

const ResponseContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  overflow-y: auto;

  @media (min-width: 768px) {
    padding: 30px 0;
  }
`;

const QueryContainer = styled.div`
  margin-bottom: 20px;

  @media (min-width: 768px) {
    margin-bottom: 30px;
  }
`;

const QueryLabel = styled.div`
  font-size: 14px;
  color: #aaa;
  margin-bottom: 5px;
`;

const Query = styled.div`
  font-size: 16px;
  color: #fff;
  background-color: #333;
  padding: 12px 16px;
  border-radius: 10px;

  @media (min-width: 768px) {
    font-size: 18px;
    padding: 16px 20px;
  }
`;

const ResponseContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #fff;
  background-color: #1a1a1a;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  flex: 1;
  overflow-y: auto;
  white-space: pre-wrap;
  
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

  @media (min-width: 768px) {
    font-size: 18px;
    line-height: 1.7;
    padding: 24px;
    margin-bottom: 30px;
  }
`;

const NewQueryButton = styled.button`
  padding: 14px 24px;
  background-color: #5472d3;
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: auto;
  align-self: center;
  
  &:hover {
    background-color: #3f5bb5;
  }

  @media (min-width: 768px) {
    padding: 16px 32px;
    font-size: 18px;
  }
`;

const ControlsArea = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    padding: 30px;
  }
`;

const VoiceButton = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$isListening ? '#e74c3c' : '#5472d3'};
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  margin-bottom: 16px;
  
  &:hover {
    background-color: ${props => props.$isListening ? '#c0392b' : '#3f5bb5'};
  }
  
  &:disabled {
    background-color: #333;
    cursor: not-allowed;
    opacity: 0.5;
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
`;

const VoiceWaves = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  gap: 3px;
`;

const Wave = styled.div`
  width: 4px;
  height: 100%;
  background-color: #fff;
  border-radius: 3px;
  animation: wave 1s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
  
  @keyframes wave {
    0%, 100% {
      height: 8px;
    }
    50% {
      height: 22px;
    }
  }
`;

const InstructionText = styled.p`
  font-size: 14px;
  color: #aaa;
  text-align: center;
`;

export default VoicePage;
