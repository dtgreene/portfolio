import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  responsiveFontSizes,
} from '@mui/material';

import { ErrorBoundary } from '../ErrorBoundary';
import { HomePage } from '../HomePage';

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4effad',
    },
  },
  typography: {
    fontFamily: 'Poppins, Helvetica',
  },
});

theme = responsiveFontSizes(theme);

export const App = () => (
  <HashRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Routes>
          <Route path="/">
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  </HashRouter>
);
