import React from 'react';
import { Box, useTheme } from '@mui/material';

const planetColor = '#4effad';

const useStyles = (theme) => ({
  planetSystem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '32px',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      width: '150px',
      height: '150px',
    },
    [theme.breakpoints.only('md')]: {
      width: '200px',
      height: '200px',
    },
    [theme.breakpoints.up('lg')]: {
      width: '260px',
      height: '260px',
    },
  },
  planet: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    boxShadow: `0 0 32px ${planetColor}`,
    overflow: 'hidden',
    background: planetColor,
    flexShrink: 0,
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
    width: '100%',
    height: '100%',
    img: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      WebkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden',
      '&:last-child': {
        transform: 'rotateY(180deg)',
      },
    },
  },
  orbit: {
    width: '300%',
    height: '300%',
    position: 'absolute',
    pointerEvents: 'none',
    svg: {
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
    [theme.breakpoints.down('md')]: {
      width: '50px',
      height: '50px',
      top: '-24px',
      left: '-57px',
    },
  },
  galaxy2: {
    width: '100px',
    height: '100px',
    top: '-113px',
    left: '283px',
    position: 'absolute',
    animation: 'bounce 15s ease-in-out infinite',
    [theme.breakpoints.down('md')]: {
      width: '80px',
      height: '80px',
      top: '-74px',
      left: '134px',
    },
    [theme.breakpoints.only('md')]: {
      left: '231px',
    },
  },
  rocket1: {
    width: '100px',
    height: '100px',
    top: '244px',
    left: '225px',
    position: 'absolute',
    animation: 'swivel 10s ease-in-out infinite',
    [theme.breakpoints.down('md')]: {
      width: '80px',
      height: '80px',
      top: '132px',
      left: '161px',
    },
    [theme.breakpoints.only('md')]: {
      top: '190px',
      left: '197px',
    },
  },
});

const Orbit = ({ index, frontClipY, rx, ry, styles }) => {
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
      d="M23.2296 106.825C28.7605 83.9901 54.4988 19.7136 64.4741 19.9111C74.4494 20.1086 106.035 105.225 98.3704 109.59C90.7062 113.956 6.02469 63.4667 8.21728 55.2296C10.4099 46.9926 114.054 51.2 114.568 59.7333C115.081 68.2667 38.8741 103.98 23.1506 105.64"
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

export const AvatarPlanet = () => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <Box sx={styles.planetSystem}>
      <Box sx={styles.planet}>
        <Box sx={styles.planetInner}>
          <img src={require('../../assets/dylan.png')} />
          <img src={require('../../assets/dylan-real.png')} />
        </Box>
      </Box>
      <Orbit index={0} frontClipY={64} rx={32} ry={3} styles={styles} />
      <Orbit index={1} frontClipY={64} rx={44} ry={6} styles={styles} />
      <Box sx={styles.galaxy1}>{Galaxy}</Box>
      <Box sx={styles.galaxy2}>{Galaxy}</Box>
      <Box sx={styles.rocket1}>{Rocket}</Box>
    </Box>
  );
};
