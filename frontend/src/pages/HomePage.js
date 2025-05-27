import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');
  const [userBio, setUserBio] = useState(localStorage.getItem('userBio') || '');
  const [responseFormat, setResponseFormat] = useState(localStorage.getItem('responseFormat') || 'standard');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user info is already set
    const hasCompletedSetup = localStorage.getItem('hasCompletedSetup') === 'true';
    if (!hasCompletedSetup) {
      setShowProfileSetup(true);
    }
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userBio', userBio);
    localStorage.setItem('responseFormat', responseFormat);
    localStorage.setItem('hasCompletedSetup', 'true');
    
    setShowProfileSetup(false);
  };

  return (
    <Container>
      {showProfileSetup ? (
        <ProfileSetupModal
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ModalHeader>
            <h2>Profile Setup</h2>
            <p>Tell us about yourself to personalize your learning experience</p>
          </ModalHeader>
          
          <FormGroup>
            <Label>Your Name</Label>
            <Input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Your Role</Label>
            <Input
              type="text"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              placeholder="e.g. Doctor, Nurse, Patient, Student"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Brief Bio</Label>
            <TextArea
              value={userBio}
              onChange={(e) => setUserBio(e.target.value)}
              placeholder="Tell us about your background or interests"
              rows={4}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Preferred Response Format</Label>
            <RadioGroup>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="responseFormat"
                  value="simple"
                  checked={responseFormat === 'simple'}
                  onChange={() => setResponseFormat('simple')}
                />
                <RadioLabel>
                  <RadioTitle>Simple</RadioTitle>
                  <RadioDescription>Clear, concise explanations with basic terms</RadioDescription>
                </RadioLabel>
              </RadioOption>
              
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="responseFormat"
                  value="standard"
                  checked={responseFormat === 'standard'}
                  onChange={() => setResponseFormat('standard')}
                />
                <RadioLabel>
                  <RadioTitle>Standard</RadioTitle>
                  <RadioDescription>Balanced detail with examples</RadioDescription>
                </RadioLabel>
              </RadioOption>
              
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="responseFormat"
                  value="advanced"
                  checked={responseFormat === 'advanced'}
                  onChange={() => setResponseFormat('advanced')}
                />
                <RadioLabel>
                  <RadioTitle>Advanced</RadioTitle>
                  <RadioDescription>In-depth explanations with technical terms</RadioDescription>
                </RadioLabel>
              </RadioOption>
            </RadioGroup>
          </FormGroup>
          
          <SaveButton 
            onClick={handleSaveProfile}
            disabled={!userName.trim()}
          >
            Save & Continue
          </SaveButton>
        </ProfileSetupModal>
      ) : (
        <>
          <Header>
            <ProfileCircle>
              <UserInitial>{userName ? userName[0].toUpperCase() : 'A'}</UserInitial>
            </ProfileCircle>
            <ProfileInfo>
              <h3>{userName || 'Personal AI Assistant'}</h3>
              <span>🟢 Online</span>
            </ProfileInfo>
          </Header>

          <GreetingText>How may I assist you today?</GreetingText>

          <OptionsContainer>
            <OptionCard as={Link} to="/chat">
              <OptionIcon>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="white" strokeWidth="1.5"/>
                  <path d="M8 10.5H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 14H13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </OptionIcon>
              <OptionText>Chat with Personal Assistant</OptionText>
              <ArrowIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ArrowIcon>
            </OptionCard>
            
            <OptionCard as={Link} to="/voice">
              <OptionIcon>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12V7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7V12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 10V12C5 16.4183 8.13401 20 12 20C15.866 20 19 16.4183 19 12V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 20V22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </OptionIcon>
              <OptionText>Talk with Personal Assistant</OptionText>
              <ArrowIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ArrowIcon>
            </OptionCard>
          </OptionsContainer>

          <HistorySection>
            <HistoryHeader>
              <h3>History</h3>
              <ViewAllLink>See all</ViewAllLink>
            </HistoryHeader>

            <HistoryList>
              {[1, 2, 3].map((item) => (
                <HistoryItem key={item}>
                  <HistoryItemIcon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </HistoryItemIcon>
                  <HistoryItemText>I need some AI inspiration for class</HistoryItemText>
                  <HistoryItemMenu>⋮</HistoryItemMenu>
                </HistoryItem>
              ))}
            </HistoryList>
          </HistorySection>
          
          <SettingsButton onClick={() => setShowProfileSetup(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Settings</span>
          </SettingsButton>
        </>
      )}
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
  padding: 24px;
  background-color: transparent;
  position: relative;
  animation: slide-up 0.8s ease-out;

  @media (min-width: 768px) {
    max-width: 700px;
    padding: 40px;
  }

  @media (min-width: 1200px) {
    max-width: 1000px;
    padding: 60px;
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.05);
    }
  }
`;

const ProfileSetupModal = styled(motion.div)`
  background: var(--bg-glass);
  backdrop-filter: var(--blur-lg);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-primary);
  width: 100%;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--primary-gradient);
    opacity: 0.6;
  }

  @media (min-width: 768px) {
    padding: 40px;
    max-width: 600px;
    margin: 0 auto;
  }

  @media (min-width: 1200px) {
    padding: 48px;
    max-width: 700px;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;
  
  h2 {
    font-size: clamp(24px, 4vw, 32px);
    font-weight: 700;
    margin-bottom: 12px;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 16px;
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  @media (min-width: 768px) {
    margin-bottom: 24px;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #ddd;

  @media (min-width: 768px) {
    font-size: 16px;
    margin-bottom: 10px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 16px;
  transition: var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: var(--bg-card);
  }
  
  &:hover {
    border-color: var(--border-primary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }

  @media (min-width: 768px) {
    padding: 18px 24px;
    font-size: 16px;
    border-radius: var(--radius-lg);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 16px 20px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 16px;
  resize: vertical;
  min-height: 120px;
  transition: var(--transition-normal);
  font-family: inherit;
  line-height: 1.6;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: var(--bg-card);
  }
  
  &:hover {
    border-color: var(--border-primary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }

  @media (min-width: 768px) {
    padding: 18px 24px;
    font-size: 16px;
    border-radius: var(--radius-lg);
    min-height: 140px;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const RadioOption = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:hover {
    border-color: #5472d3;
  }

  @media (min-width: 768px) {
    padding: 16px;
    border-radius: 10px;
  }
`;

const RadioInput = styled.input`
  margin-top: 4px;
  margin-right: 12px;
  accent-color: #5472d3;
`;

const RadioLabel = styled.div`
  flex: 1;
`;

const RadioTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const RadioDescription = styled.div`
  font-size: 12px;
  color: #aaa;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 18px 24px;
  background: var(--primary-gradient);
  color: var(--text-primary);
  border: none;
  border-radius: var(--radius-lg);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: var(--bg-tertiary);
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: var(--shadow-md);
    }
  }

  @media (min-width: 768px) {
    padding: 20px 32px;
    font-size: 18px;
    border-radius: var(--radius-xl);
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 48px;
  animation: slide-up 0.6s ease-out 0.2s both;
`;

const ProfileCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  box-shadow: var(--shadow-md);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: var(--primary-gradient);
    z-index: -1;
    opacity: 0.3;
    animation: pulse-glow 2s ease-in-out infinite;
  }
`;

const UserInitial = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const ProfileInfo = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 6px;
    color: var(--text-primary);
  }
  
  span {
    font-size: 14px;
    color: var(--success-color);
    display: flex;
    align-items: center;
    gap: 6px;
    
    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success-color);
      animation: pulse 2s ease-in-out infinite;
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const GreetingText = styled.h1`
  font-size: clamp(28px, 6vw, 42px);
  font-weight: 800;
  margin-bottom: 40px;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-align: center;
  animation: slide-up 0.6s ease-out 0.4s both;

  @media (min-width: 768px) {
    margin-bottom: 48px;
  }
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 48px;
  animation: slide-up 0.6s ease-out 0.6s both;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 36px;
    max-width: 800px;
  }
`;

const OptionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: var(--text-primary);
  transition: var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s;
  }
  
  &:hover {
    background: var(--glass-bg-hover);
    border-color: var(--primary-color);
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--shadow-lg);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.01);
  }

  @media (min-width: 768px) {
    padding: 40px 28px;
    border-radius: var(--radius-2xl);
  }
`;

const OptionIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  transition: var(--transition-normal);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  
  ${OptionCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
  }
  
  @media (min-width: 768px) {
    font-size: 56px;
    margin-bottom: 20px;
  }
`;

const OptionText = styled.h3`
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
  color: var(--text-primary);
  transition: var(--transition-normal);
  
  ${OptionCard}:hover & {
    color: var(--primary-color);
    transform: translateY(-2px);
  }
  
  @media (min-width: 768px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
`;

const ArrowIcon = styled.span`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 18px;
  color: var(--text-secondary);
  transition: var(--transition-normal);
  
  ${OptionCard}:hover & {
    color: var(--primary-color);
    transform: translateX(4px);
  }
  
  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const HistorySection = styled.section`
  margin-bottom: 40px;
  animation: slide-up 0.6s ease-out 0.8s both;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const ViewAllLink = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  
  &:hover {
    background: var(--glass-bg);
    color: var(--accent-color);
    transform: translateX(4px);
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 16px;
  }

  @media (min-width: 1200px) {
    gap: 20px;
  }
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: var(--glass-bg-hover);
    border-color: var(--primary-color);
    transform: translateX(8px);
    box-shadow: var(--shadow-md);
    
    &::before {
      left: 100%;
    }
  }

  @media (min-width: 768px) {
    padding: 18px 24px;
  }

  @media (min-width: 1200px) {
    padding: 20px 28px;
  }
`;

const HistoryItemIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-sm);
  
  ${HistoryItem}:hover & {
    transform: scale(1.1);
    box-shadow: var(--shadow-md);
  }
`;

const HistoryItemText = styled.p`
  flex: 1;
  font-size: 15px;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: var(--transition-normal);
  
  ${HistoryItem}:hover & {
    color: var(--text-primary);
  }
  
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const HistoryItemMenu = styled.button`
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-sm);
  transition: var(--transition-normal);
  
  &:hover {
    color: var(--primary-color);
    background: var(--glass-bg);
    transform: scale(1.1);
  }
`;

const SettingsButton = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: 50px;
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-md);
  z-index: 1000;
  
  &:hover {
    background: var(--glass-bg-hover);
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    transition: var(--transition-normal);
  }
  
  &:hover svg {
    transform: rotate(90deg);
    color: var(--primary-color);
  }

  @media (min-width: 768px) {
    bottom: 40px;
    right: 40px;
    padding: 16px 24px;
    font-size: 16px;
  }
`;

export default HomePage;