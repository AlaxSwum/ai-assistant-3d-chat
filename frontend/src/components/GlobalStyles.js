import { createGlobalStyle } from 'styled-components';
import { media } from './Breakpoints';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    /* Enhanced Color Palette */
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    --success-gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    --warning-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #4facfe;
    --success-color: #43e97b;
    --warning-color: #fa709a;
    --error-color: #ff6b6b;
    
    --bg-primary: #0a0a0a;
    --bg-secondary: #111111;
    --bg-tertiary: #1a1a1a;
    --bg-card: rgba(26, 26, 26, 0.8);
    --bg-glass: rgba(255, 255, 255, 0.05);
    
    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
    --text-tertiary: #666666;
    --text-muted: #404040;
    
    --border-primary: rgba(255, 255, 255, 0.1);
    --border-secondary: rgba(255, 255, 255, 0.05);
    --border-accent: rgba(102, 126, 234, 0.3);
    
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.2);
    --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.3);
    --shadow-xl: 0 16px 64px rgba(0, 0, 0, 0.4);
    --shadow-glow: 0 0 20px rgba(102, 126, 234, 0.3);
    
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-full: 9999px;
    
    --transition-fast: 0.15s ease;
    --transition-normal: 0.25s ease;
    --transition-slow: 0.4s ease;
    
    --blur-sm: blur(4px);
    --blur-md: blur(8px);
    --blur-lg: blur(16px);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: var(--bg-primary);
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(79, 172, 254, 0.05) 0%, transparent 50%);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
    transition: var(--transition-normal);
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: var(--transition-fast);
  }

  input, textarea {
    font-family: inherit;
    transition: var(--transition-normal);
  }

  /* Enhanced Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.025em;
  }

  h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
  h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); }
  h3 { font-size: clamp(1.25rem, 3vw, 2rem); }
  h4 { font-size: clamp(1.125rem, 2.5vw, 1.5rem); }
  h5 { font-size: clamp(1rem, 2vw, 1.25rem); }
  h6 { font-size: clamp(0.875rem, 1.5vw, 1rem); }

  p {
    line-height: 1.7;
    color: var(--text-secondary);
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

  /* Enhanced focus styles for accessibility */
  *:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  /* Custom scrollbar with glassmorphism */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
    border-radius: var(--radius-sm);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--bg-glass);
    border-radius: var(--radius-sm);
    border: 2px solid var(--bg-secondary);
    backdrop-filter: var(--blur-sm);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Selection styles */
  ::selection {
    background: rgba(102, 126, 234, 0.3);
    color: var(--text-primary);
  }

  /* Utility classes */
  .glass {
    background: var(--bg-glass);
    backdrop-filter: var(--blur-md);
    border: 1px solid var(--border-primary);
  }

  .gradient-text {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: var(--shadow-md); }
    50% { box-shadow: var(--shadow-glow); }
  }

  .animate-slide-up {
    animation: slide-up 0.6s ease-out;
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
`;

export default GlobalStyles;