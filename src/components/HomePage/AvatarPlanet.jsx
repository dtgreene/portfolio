import React from 'react';
import { Box } from '@mui/material';

const planetColor = '#4effad';

const styles = {
  planetSystem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '32px',
    position: 'relative',
    width: '256px',
    height: '256px',
  },
  planet: {
    borderRadius: '50%',
    boxShadow: `0 0 32px ${planetColor}`,
    overflow: 'hidden',
    background: planetColor,
    flexShrink: 0,
    width: '256px',
    height: '256px',
    perspective: '1000px',
    '&:hover': {
      div: {
        transform: 'rotateY(180deg)',
      },
    },
  },
  planetInner: {
    position: 'relative',
    transition: 'transform 0.8s',
    transformStyle: 'preserve-3d',
    pointerEvents: 'none',
    img: {
      position: 'absolute',
      width: '256px',
      height: '256px',
      WebkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden',
      '&:last-child': {
        transform: 'rotateY(180deg)',
      },
    },
  },
  orbit: {
    width: '768px',
    height: '768px',
    position: 'absolute',
    pointerEvents: 'none',
    svg: {
      filter: 'drop-shadow(0 0 4px #fff)',
      animation: 'blinker 3s ease-in-out infinite',
    },
  },
  galaxy1: {
    width: '64px',
    height: '64px',
    top: '-19px',
    left: '-91px',
    position: 'absolute',
    animation: 'bounce 15s ease-in-out infinite',
    animationDelay: '-8s',
    svg: {
      filter: 'drop-shadow(0 0 4px #fff)',
    },
  },
  galaxy2: {
    width: '100px',
    height: '100px',
    top: '-113px',
    left: '283px',
    position: 'absolute',
    animation: 'bounce 15s ease-in-out infinite',
    svg: {
      filter: 'drop-shadow(0 0 4px #fff)',
    },
  },
  rocket1: {
    width: '100px',
    height: '100px',
    top: '244px',
    left: '225px',
    position: 'absolute',
    animation: 'swivel 10s ease-in-out infinite',
    svg: {
      filter: 'drop-shadow(0 0 4px #fff)',
    },
  },
};

const Orbit = ({ index, frontClipY, rx, ry }) => {
  const tempMaskId = `sun-mask-${index}-temp`;
  const maskId = `sun-mask-${index}`;
  return (
    <Box sx={styles.orbit}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 128 128"
        style={{ animationDelay: `${(index * 0.4).toFixed(2)}s` }}
      >
        <defs>
          <mask id={tempMaskId}>
            <circle cx="64" cy="64" r="21.5" fill="#fff" />
            <rect x="42" y={frontClipY} width="44" height="32" fill="#000" />
          </mask>
          <mask id={maskId}>
            <rect width="128" height="128" fill="#fff" />
            <rect
              width="128"
              height="128"
              fill="#000"
              mask={`url(#${tempMaskId})`}
            />
          </mask>
        </defs>
        <ellipse
          cx="64"
          cy="64"
          rx={rx}
          ry={ry}
          fill="none"
          stroke="#fff"
          // strokeDasharray="2"
          strokeWidth="0.5"
          mask={`url(#${maskId})`}
        />
      </svg>
    </Box>
  );
};

const Galaxy = (
  <svg
    height="100%"
    viewBox="0 0 128 128"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M33.1062 117.965C28.0691 109.748 17.8765 100.82 12.958 85.0963C8.03951 69.3728 7.84969 65.0344 8.74778 55.6045C9.58436 46.8204 14.8126 31.7016 27.02 20.3633C39.2274 9.02507 49.907 7.27194 63.5859 6.01315C76.1152 4.86014 87.7693 7.99259 97.4053 12.8106C105.629 16.9227 113.686 24.0558 119.331 35.9723C124.532 46.95 123.788 66.0944 119.862 77.3531C114.861 91.6947 104.538 103.108 95.1309 108.247C84.3303 114.147 76.9349 116.894 63.7537 117.542C53.5156 118.045 49.5605 118.4 42.5086 112.435C35.4568 106.469 31.193 97.9887 29.5986 93.2053C27.8925 88.0871 26.5235 85.385 25.6544 74.6591C24.7852 63.9332 25.3187 56.6165 29.0111 48.4763C33.1445 39.3642 36.1702 34.4166 47.4734 27.8322C56.1171 22.797 69.1862 22.2421 76.929 24.0558C86.2441 26.2377 93.3622 28.8477 101.014 37.8185C105.881 43.5251 108.691 49.7751 107.308 61.5677C105.925 73.3603 101.769 81.037 95.643 86.5756C85.8915 95.3921 78.9728 97.6395 69.0568 98.6074C59.1407 99.5753 55.7885 97.3653 51.2497 91.443C46.5031 85.2493 44.3387 79.599 44.5362 70.2953C44.7337 60.9916 48.2286 55.2738 53.1799 51.3295C57.5585 47.8415 61.4556 46.1266 68.7049 46.1266C75.9543 46.1266 83.3069 49.6512 86.7476 53.6793C90.1883 57.7074 90.6973 63.1152 89.0973 69.7918C87.4973 76.4683 82.2317 77.5909 79.7823 78.8551C77.3329 80.1193 68.538 80.9987 66.1874 77.6802C63.8367 74.3617 62.1533 68.8158 64.7607 64.9245C67.3681 61.0331 77.7682 62.4069 77.7682 62.4069"
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
    />
  </svg>
);

const Rocket = (
  <svg
    height="100%"
    viewBox="0 0 128 128"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
    >
      <path d="M42.9827 108.089C42.9827 108.089 31.9211 61.2995 38.637 36.1877C44.0889 15.8025 57.0469 4.10864 57.0469 4.10864C57.0469 4.10864 74.0346 17.3827 77.9062 36.3457C82.9967 61.279 73.1654 107.615 73.1654 107.615L42.9827 108.089Z" />
      <path d="M46.6963 41.521C46.6963 35.6081 51.5427 30.8148 57.521 30.8148C63.4993 30.8148 68.3457 35.6081 68.3457 41.521C68.3457 47.4338 63.4993 52.2272 57.521 52.2272C51.5427 52.2272 46.6963 47.4338 46.6963 41.521Z" />
      <path d="M37.7679 77.2741C37.7679 77.2741 27.8321 84.484 22.9926 94.3407C18.1531 104.198 18.2519 123.338 18.2519 123.338L42.6667 108.01L37.7679 77.2741Z" />
      <path d="M74.0346 107.22L99.2395 121.6C99.2395 121.6 100.148 110.163 94.4988 99.4765C88.8494 88.7901 78.6963 77.5111 78.6963 77.5111L74.0346 107.22Z" />
    </g>
  </svg>
);

export const AvatarPlanet = () => (
  <Box sx={styles.planetSystem}>
    <Box sx={styles.planet}>
      <Box sx={styles.planetInner}>
        <img src={require('../../assets/dylan.png')} />
        <img src={require('../../assets/dylan-real.png')} />
      </Box>
    </Box>
    <Orbit index={0} frontClipY={64} rx={32} ry={3} />
    <Orbit index={1} frontClipY={64} rx={44} ry={6} />
    <Orbit index={2} frontClipY={64} rx={56} ry={9} />
    <Box sx={styles.galaxy1}>{Galaxy}</Box>
    <Box sx={styles.galaxy2}>{Galaxy}</Box>
    <Box sx={styles.rocket1}>{Rocket}</Box>
  </Box>
);
