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
            main: '#f0dbb0',
            light: '#f7ebcf',
            dark: '#e5c98f',
            contrastText: '#76a345',
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
                        boxShadow: '0 8px 16px rgba(35, 92, 139, 0.2)',
                    },
                },
                containedPrimary: {
                    background: '#76a345',
                    '&:hover': {
                        background: '#5a7d34',
                    }
                },
                containedSecondary: {
                    background: '#f0dbb0',
                    color: '#76a345',
                    '&:hover': {
                        background: '#e5c98f',
                    }
                }
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
        MuiTextField: {
            defaultProps: {
                size: 'small',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: '#76a345',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#76a345',
                        },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#76a345',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#76a345',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#76a345',
                    },
                },
            },
        },
    },
});

export default theme;
