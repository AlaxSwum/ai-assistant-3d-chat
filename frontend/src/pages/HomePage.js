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
              placeholder="Tell us about your medical background or health interests"
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
              <h3>{userName || 'Medical AI Assistant'}</h3>
              <span>🟢 Online</span>
            </ProfileInfo>
          </Header>

          <GreetingText>How may I assist with your medical questions today?</GreetingText>

          <OptionsContainer>
            <OptionCard as={Link} to="/chat">
              <OptionIcon>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="white" strokeWidth="1.5"/>
                  <path d="M8 10.5H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 14H13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </OptionIcon>
              <OptionText>Chat with Medical Assistant</OptionText>
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
              <OptionText>Talk with Medical Assistant</OptionText>
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

  @media (min-width: 768px) {
    max-width: 700px;
    padding: 40px;
  }

  @media (min-width: 1200px) {
    max-width: 1000px;
    padding: 60px;
  }
`;

const ProfileSetupModal = styled(motion.div)`
  background-color: #111;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  width: 100%;

  @media (min-width: 768px) {
    padding: 32px;
    max-width: 600px;
    margin: 0 auto;
  }

  @media (min-width: 1200px) {
    padding: 40px;
    max-width: 700px;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 24px;
  
  h2 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  p {
    color: #aaa;
    font-size: 14px;
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
  padding: 12px 16px;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #5472d3;
  }
  
  &::placeholder {
    color: #666;
  }

  @media (min-width: 768px) {
    padding: 14px 18px;
    font-size: 16px;
    border-radius: 10px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #5472d3;
  }
  
  &::placeholder {
    color: #666;
  }

  @media (min-width: 768px) {
    padding: 14px 18px;
    font-size: 16px;
    border-radius: 10px;
    min-height: 120px;
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
  padding: 14px;
  background-color: #5472d3;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3f5bb5;
  }
  
  &:disabled {
    background-color: #333;
    cursor: not-allowed;
    opacity: 0.7;
  }

  @media (min-width: 768px) {
    padding: 16px;
    font-size: 18px;
    border-radius: 10px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const ProfileCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #5472d3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const UserInitial = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
`;

const ProfileInfo = styled.div`
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  span {
    font-size: 12px;
    color: #aaa;
  }
`;

const GreetingText = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  color: #fff;

  @media (min-width: 768px) {
    font-size: 36px;
    margin-bottom: 40px;
  }
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 40px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
    max-width: 800px;
  }
`;

const OptionCard = styled(motion.div).attrs(() => ({
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.98 },
}))`
  background-color: ${props => props.color || '#1a1a1a'};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  border: 1px solid #333;
  
  &:nth-child(1) {
    background-color: #2d2d2d;
  }
  
  &:nth-child(2) {
    background-color: #3d3566;
  }

  @media (min-width: 768px) {
    padding: 28px;
    min-height: 180px;
  }

  @media (min-width: 1200px) {
    padding: 32px;
    min-height: 200px;
  }
`;

const OptionIcon = styled.div`
  font-size: 28px;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    font-size: 32px;
    margin-bottom: 16px;
  }
`;

const OptionText = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;

  @media (min-width: 768px) {
    font-size: 20px;
    margin-bottom: 12px;
  }
`;

const ArrowIcon = styled.span`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 16px;
  opacity: 0.7;
`;

const HistorySection = styled.div`
  margin-top: auto;
  width: 100%;

  @media (min-width: 768px) {
    margin-top: 60px;
  }

  @media (min-width: 1200px) {
    max-width: 800px;
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;

    @media (min-width: 768px) {
      font-size: 22px;
    }
  }
`;

const ViewAllLink = styled.a`
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

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
  padding: 14px;
  background-color: #1a1a1a;
  border-radius: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #222;
  }

  @media (min-width: 768px) {
    padding: 18px;
  }

  @media (min-width: 1200px) {
    padding: 20px;
  }
`;

const HistoryItemIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #8e44ad;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const HistoryItemText = styled.p`
  flex: 1;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HistoryItemMenu = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
`;

const SettingsButton = styled.button`
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #222;
  border: 1px solid #333;
  border-radius: 30px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: #333;
  }
  
  svg {
    opacity: 0.7;
  }

  @media (min-width: 768px) {
    bottom: 40px;
    right: 40px;
    padding: 12px 20px;
    font-size: 16px;
  }
`;

export default HomePage; 