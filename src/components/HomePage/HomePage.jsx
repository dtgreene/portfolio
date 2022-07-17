import React from 'react';
import { Box, Link, Typography } from '@mui/material';

import { AvatarPlanet } from './AvatarPlanet';

import './HomePage.scss';

const styles = {
  container: {
    marginTop: '150px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  stars: {
    backgroundImage: `url(${require('../../assets/background-stars.png')})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover, 100%',
    backgroundPosition: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: '-100',
  },
  solarSystem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // width: '100%',
    // minHeight: 'calc(100vh - 150px)',
  },
  breadCrumb: {
    width: '16px',
    height: '16px',
    background: '#fff',
    borderRadius: '50%',
    marginBottom: '32px',
    boxShadow: '0 0 8px #fff',
  },
  breadCrumbPrimary: {
    width: '8px',
    height: '8px',
    background: '#4effad',
    borderRadius: '50%',
    boxShadow: '0 0 8px #4effad',
  },
  textBlock: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  moon: {
    position: 'relative',
    width: '256px',
    height: '256px',
    img: {
      width: '256px',
      height: '256px',
      animation: 'bob 5s ease-in-out infinite',
    },
    svg: {
      position: 'absolute',
      width: '256px',
      height: '256px',
      top: '0',
      left: '0',
      animation: 'bob 5s ease-in-out infinite',
    },
  },
  linkRow: { display: 'flex', gap: '16px', alignItems: 'center' },
};

export const HomePage = () => (
  <Box sx={styles.container}>
    <Box sx={styles.stars} />
    <Box sx={styles.solarSystem}>
      <Box sx={styles.textBlock}>
        <Typography variant="h4">Hi I'm</Typography>
        <Typography variant="h2" color="primary" fontFamily="Gloria Hallelujah">
          Dylan Greene
        </Typography>
      </Box>
      <Box>
        <Box sx={styles.breadCrumb} />
        <Box sx={styles.breadCrumb} />
        <Box sx={styles.breadCrumb} />
      </Box>
      <AvatarPlanet />
      <Box>
        <Box sx={styles.breadCrumb} />
        <Box sx={styles.breadCrumb} />
      </Box>
      <Box sx={styles.textBlock}>
        <Typography variant="h5">Front-end Developer</Typography>
      </Box>
      <Box sx={styles.linkRow}>
        <Link
          variant="h5"
          color="primary"
          fontFamily="Gloria Hallelujah"
          href="https://github.com/dtgreene"
          target="_blank"
        >
          GitHub
        </Link>
        <Box sx={styles.breadCrumbPrimary} />
        <Link
          variant="h5"
          color="primary"
          fontFamily="Gloria Hallelujah"
          href="https://www.linkedin.com/in/dylan-greene/"
          target="_blank"
        >
          LinkedIn
        </Link>
        <Box sx={styles.breadCrumbPrimary} />
        <Link
          variant="h5"
          color="primary"
          fontFamily="Gloria Hallelujah"
          href="https://codepen.io/dylangggg"
          target="_blank"
        >
          Codepen
        </Link>
      </Box>
      {/* <Box sx={styles.moon}>
        <img src={require('../../assets/cheese.png')} />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
          <ellipse
            cx="64"
            cy="64"
            rx="62"
            ry="62"
            fill="none"
            stroke="#aaa"
            strokeDasharray="4"
            strokeWidth="1"
          />
        </svg>
      </Box> */}
    </Box>
  </Box>
);
