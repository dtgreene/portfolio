import React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  responsiveFontSizes,
} from '@mui/material';

import { ErrorBoundary } from '../ErrorBoundary';
import { Home } from 'src/pages';

import './App.css';

const baseTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4effad',
    },
    background: 'blue',
  },
  typography: {
    fontFamily: 'Poppins, Helvetica',
  },
});
const theme = responsiveFontSizes(baseTheme);

export const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  </ThemeProvider>
);
