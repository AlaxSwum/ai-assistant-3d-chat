import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyles from './components/GlobalStyles';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import VoicePage from './pages/VoicePage';
import { media } from './components/Breakpoints';

// Responsive app container
const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #000;
  background-image: radial-gradient(circle at 50% 50%, #111 0%, #000 100%);
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='smallGrid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23222' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23smallGrid)'/%3E%3C/svg%3E");
    opacity: 0.2;
    z-index: -1;
  }

  ${media.desktop} {
    padding: 0 20px;
  }
`;

// Wrapper for routes to ensure consistent sizing
const ContentWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
`;

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <AppContainer>
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/voice" element={<VoicePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ContentWrapper>
      </AppContainer>
    </BrowserRouter>
  );
}

export default App; 