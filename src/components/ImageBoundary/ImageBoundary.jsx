import { useEffect, useRef, useState } from 'react';
import Fade from '@mui/material/Fade';

export const ImageBoundary = ({ children, images }) => {
  const [ready, setReady] = useState(false);
  const data = useRef({ started: false, loadedCount: 0 });

  useEffect(() => {
    if (data.current.started) return;

    images.forEach((src) => {
      let image = new Image();
      image.onload = () => {
        data.current.loadedCount++;
        if (data.current.loadedCount === images.length) {
          setReady(true);
        }
      };
      image.src = src;
    });

    data.current.started = true;
  }, []);

  return (
    <Fade in={ready} timeout={500}>
      {children}
    </Fade>
  );
};
