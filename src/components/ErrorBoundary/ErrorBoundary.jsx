import React from 'react';
import {
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            And then this happened...
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>{error.message}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {error.stack?.split('\n').map((line, index) => (
                <Typography key={index}>{line}</Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        </Container>
      );
    }

    return this.props.children;
  }
}
