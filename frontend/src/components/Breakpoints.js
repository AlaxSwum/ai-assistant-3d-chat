// Breakpoints for responsive design
const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1200px',
  largeDesktop: '1440px'
};

// Media query helper functions
export const media = {
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  laptop: `@media (min-width: ${breakpoints.laptop})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  largeDesktop: `@media (min-width: ${breakpoints.largeDesktop})`
};

export default breakpoints; 