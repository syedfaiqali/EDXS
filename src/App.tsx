import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {
  ThemeProvider, CssBaseline, Box, CircularProgress, AppBar, Toolbar, Container,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, Typography
} from '@mui/material';
import { Language } from '@mui/icons-material';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme/theme';
import Logo from './components/Logo';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));

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
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const { language, setLanguage, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempLang, setTempLang] = useState(language);

  const handleOpenModal = () => {
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
        position={isLanding ? 'absolute' : 'static'}
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: isLanding ? 'none' : '1px solid rgba(0,0,0,0.05)',
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box sx={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
              <Logo />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 600 }}>
                {t('enterprise_solutions')}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Language />}
                onClick={handleOpenModal}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: 'rgba(0,0,0,0.1)',
                  color: 'text.secondary'
                }}
              >
                {t('change_language')}
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'background.default' }}>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
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
