import { createGlobalStyle } from 'styled-components';
import { media } from './Breakpoints';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    background-color: #000;
    color: #fff;
    min-height: 100vh;
    overflow-x: hidden;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  input, textarea {
    font-family: inherit;
  }

  /* Responsive font sizes */
  html {
    font-size: 16px;
    
    ${media.tablet} {
      font-size: 16px;
    }
    
    ${media.laptop} {
      font-size: 17px;
    }
    
    ${media.desktop} {
      font-size: 18px;
    }
  }

  /* Improve focus styles for accessibility */
  *:focus-visible {
    outline: 2px solid #5472d3;
    outline-offset: 2px;
  }

  /* Improve scrollbar appearance */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #111;
  }

  ::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #444;
  }
`;

export default GlobalStyles; 