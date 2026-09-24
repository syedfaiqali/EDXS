import { alpha, createTheme } from '@mui/material/styles';

const ink = '#182334';
const green = '#6f963f';
const deepGreen = '#45672a';
const cream = '#f5f7ef';

const theme = createTheme({
    palette: {
        primary: { main: green, light: '#96b96d', dark: deepGreen, contrastText: '#fff' },
        secondary: { main: '#e9efdd', light: '#f6f8f1', dark: '#d5e0c0', contrastText: deepGreen },
        background: { default: cream, paper: '#ffffff' },
        text: { primary: ink, secondary: '#627083' },
        divider: '#dfe7d4',
    },
    typography: {
        fontFamily: '"Nunito Sans", "Inter", "Roboto", Arial, sans-serif',
        h1: { fontWeight: 900, fontSize: 'clamp(2.1rem, 5vw, 2.75rem)', letterSpacing: '-0.045em', lineHeight: 1.03, color: ink },
        h2: { fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.1rem)', letterSpacing: '-0.035em', lineHeight: 1.1 },
        h3: { fontWeight: 800, fontSize: 'clamp(1.35rem, 3vw, 1.55rem)', letterSpacing: '-0.02em' },
        button: { fontWeight: 800, letterSpacing: '0.01em' },
        body1: { fontSize: '1rem', lineHeight: 1.7 },
    },
    shape: { borderRadius: 16 },
    components: {
        MuiCssBaseline: { styleOverrides: { body: { backgroundColor: cream, color: ink, overflowX: 'hidden' } } },
        MuiContainer: { styleOverrides: { root: { paddingLeft: 20, paddingRight: 20, '@media (min-width:600px)': { paddingLeft: 32, paddingRight: 32 } } } },
        MuiDialog: { styleOverrides: { paper: { margin: 16, width: 'calc(100% - 32px)', maxHeight: 'calc(100dvh - 32px)' } } },
        MuiButton: { styleOverrides: { root: { textTransform: 'none', padding: '11px 22px', borderRadius: 12, transition: 'transform .2s ease, box-shadow .2s ease, background-color .2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 12px 24px ${alpha(deepGreen, .16)}` } }, containedPrimary: { boxShadow: `0 8px 18px ${alpha(deepGreen, .2)}`, '&:hover': { background: deepGreen } } } },
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
        MuiCard: { styleOverrides: { root: { border: '1px solid #e2ead7', boxShadow: '0 12px 30px rgba(24,35,52,.06)', overflow: 'hidden', transition: 'transform .25s ease, box-shadow .25s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(24,35,52,.12)' } } } },
        MuiTextField: { defaultProps: { size: 'small' } },
        MuiOutlinedInput: { styleOverrides: { root: { backgroundColor: '#fff', borderRadius: 12, '&.Mui-focused .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline': { borderColor: green } } } },
    },
});

export default theme;
