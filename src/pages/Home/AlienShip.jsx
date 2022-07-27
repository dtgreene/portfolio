import React, { useEffect } from 'react';
import { Box } from '@mui/material';

import { subscribe, unsubscribe, MainLoopEvents } from 'src/hooks/useMainLoop';

const styles = {
  container: {
    width: '100%',
    height: '300px',
    position: 'relative',
  },
  ship: {
    position: 'absolute',
    height: '100%',
    animation: 'bob 3s ease-in-out infinite',
    img: {
      zIndex: 10,
      position: 'absolute',
    },
  },
  rope: {
    position: 'absolute',
    width: '64px',
    height: '4px',
    background: '#575757',
    left: '225px',
    top: '135px',
  },
};

const shipStartX = -600;
const shipEndX = 100;

let ship;
let shipLeft = shipStartX;
let lastWindowWidth = window.innerWidth;

export const AlienShip = () => {
  useEffect(() => {
    // add event listener for window events
    window.addEventListener('resize', resizeHandler, false);
    // subscribe to the mainloop event
    subscribe(MainLoopEvents.UPDATE, update);

    // callback when component un-mounts
    return () => {
      // unsubscribe from events
      window.removeEventListener('resize', resizeHandler, false);
      unsubscribe(MainLoopEvents.UPDATE, update);
    };
  }, []);

  return (
    <Box sx={styles.container}>
      <Box
        sx={styles.ship}
        ref={(node) => (ship = node)}
        style={{
          left: `${shipLeft}px`,
        }}
      >
        <img
          src={require('../../assets/hire-me.gif')}
          style={{
            width: '256px',
            height: '128px',
            top: '64px',
          }}
        />
        <Box sx={styles.rope} />
        <img
          src={require('../../assets/alien-ship.png')}
          style={{
            width: '256px',
            height: '256px',
            top: '10px',
            left: '245px',
          }}
        />
      </Box>
    </Box>
  );
};

function resizeHandler() {
  // remap the left position to the new window size
  shipLeft = window.innerWidth * (shipLeft / lastWindowWidth);
  lastWindowWidth = window.innerWidth;
}

function update() {
  ship.style.left = `${(shipLeft += 2)}px`;

  if (shipLeft > window.innerWidth + shipEndX) {
    shipLeft = shipStartX;
  }
}
