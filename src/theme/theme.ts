import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#76a345',
      light: '#94bc65',
      dark: '#5a7d34',
      contrastText: '#fff',
    },
    secondary: {
      main: '#2c3e50',
      dark: '#1e293b',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#1e293b',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          borderRadius: 10,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(118, 163, 69, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #76a345 0%, #94bc65 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.05)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});

export default theme;
