import React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  responsiveFontSizes,
} from '@mui/material';

import { Home } from 'src/pages';
import { ImageBoundary } from '../ImageBoundary';

import DylanImage from 'src/assets/images/dylan.png';
import DylanRealImage from 'src/assets/images/dylan-real.png';
import BackgroundStarsImage from 'src/assets/images/background-stars.png';
import StarSpinImage from 'src/assets/images/star-spin.gif';
import CheeseImage from 'src/assets/images/cheese.png';
import StarImage from 'src/assets/images/star.png';

const baseTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4effad',
    },
    background: {
      default: '#010102'
    }
  },
  typography: {
    fontFamily: 'Poppins, Helvetica',
  },
});
const theme = responsiveFontSizes(baseTheme);

const imagesToPreload = [
  DylanImage,
  DylanRealImage,
  BackgroundStarsImage,
  StarSpinImage,
  CheeseImage,
  StarImage,
];

export const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ImageBoundary images={imagesToPreload}>
      <Home />
    </ImageBoundary>
  </ThemeProvider>
);
