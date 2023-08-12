import { useEffect, useRef, useState } from 'react';
import Fade from '@mui/material/Fade';

const FADE_TIMEOUT = 500;

export const ImageBoundary = ({ children, images }) => {
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const startTime = performance.now();
    let loadCount = 0;

    images.forEach((src) => {
      let image = new Image();
      image.onload = () => {
        loadCount++;
        if (loadCount === images.length) {
          setReady(true);
        }
      };
      image.src = src;
    });

    initialized.current = true;
  }, []);

  return (
    <Fade in={ready} timeout={FADE_TIMEOUT}>
      {children}
    </Fade>
  );
};
