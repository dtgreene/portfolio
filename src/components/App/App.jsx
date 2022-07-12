import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

import { ErrorBoundary } from '../ErrorBoundary';
import { HomePage } from '../HomePage';

const darkTheme = createTheme({
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

export const App = () => (
  <BrowserRouter>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <Routes>
          <Route path="/">
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  </BrowserRouter>
);
