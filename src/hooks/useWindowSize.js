import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const debounced = debounce(handleResize, 100);
    // Add event listener
    window.addEventListener('resize', debounced);
    // Call handler right away so state gets updated with initial window size
    debounced();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', debounced);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
