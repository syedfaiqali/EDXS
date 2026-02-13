import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
  ThemeProvider, CssBaseline, Box, CircularProgress, AppBar, Toolbar, Container,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, Typography
} from '@mui/material';
import { Translate } from '@mui/icons-material';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { resetFlow } from './store/selectionSlice';
import theme from './theme/theme';
import Logo from './components/Logo';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));

const LoadingScreen = () => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    gap: 2
  }}>
    <CircularProgress color="primary" />
    <Logo size="large" />
  </Box>
);

const MainLayout: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempLang, setTempLang] = useState(language);

  const handleOpenLanguageModal = () => {
    setTempLang(language);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveLanguage = () => {
    setLanguage(tempLang);
    handleCloseModal();
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: '#76a345',
          borderBottom: 'none',
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 4 }} onClick={() => dispatch(resetFlow())}>
              <Logo size="small" />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 4 }}>
              {['Home', 'About Us', 'Products', 'Services', 'Team'].map((item) => (
                <Typography
                  key={item}
                  variant="body2"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    opacity: 1,
                    '&:hover': { opacity: 0.8 },
                    borderBottom: item === 'Home' ? '2px solid white' : 'none',
                    pb: 0.5,
                    px: 0.5
                  }}
                  onClick={() => item === 'Home' ? dispatch(resetFlow()) : null}
                >
                  {item}
                </Typography>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Translate
                sx={{ color: 'white', cursor: 'pointer', opacity: 0.8, '&:hover': { opacity: 1 } }}
                onClick={handleOpenLanguageModal}
              />
              <Typography sx={{ color: 'white', fontSize: '0.8rem', cursor: 'pointer', display: { xs: 'none', lg: 'block' } }}>Contact us</Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/registration')}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Get A Demo
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/registration')}
                sx={{
                  bgcolor: '#f0dbb0',
                  color: '#76a345',
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { bgcolor: '#e5c98f' }
                }}
              >
                Start Free Trial
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{
        flexGrow: 1,
        backgroundColor: 'background.default',
      }}>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Box>

      <Box component="footer" sx={{ py: 4, textAlign: 'center', bgcolor: 'secondary.dark', color: 'white' }}>
        <Container maxWidth="lg">
          <Logo size="small" />
          <Box sx={{ opacity: 0.6, mt: 2, fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} EDXS Solutions. {t('all_rights_reserved')}
          </Box>
        </Container>
      </Box>

      {/* Language Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{t('select_language')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="language-select-label">{t('select_language')}</InputLabel>
              <Select
                labelId="language-select-label"
                value={tempLang}
                label={t('select_language')}
                onChange={(e) => setTempLang(e.target.value as any)}
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Urdu">Urdu (اردو)</MenuItem>
                <MenuItem value="Arabic">Arabic (العربية)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseModal} sx={{ color: 'text.secondary' }}>
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveLanguage}
            sx={{ px: 4 }}
          >
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <MainLayout />
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  );
};

export default App;
