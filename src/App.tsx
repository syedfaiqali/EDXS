import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, NavLink } from 'react-router-dom';
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
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';


import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import AboutUsPage from './pages/AboutUsPage';
import ProductsPage from './pages/ProductsPage';
import ServicesPage from './pages/ServicesPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import ProgramsPage from './pages/ProgramsPage';
import AdmissionPage from './pages/AdmissionPage';
import CareerPage from './pages/CareerPage';

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
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const { language, setLanguage, t } = useLanguage();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempLang, setTempLang] = useState(language);
  const [isScrolled, setIsScrolled] = useState(false);
  const currentPath = location.pathname;
  const isHomeAtTop = currentPath === '/' && !isScrolled;

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 24);

    updateScrolledState();
    window.addEventListener('scroll', updateScrolledState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolledState);
  }, [currentPath]);
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
          bgcolor: isHomeAtTop ? 'transparent' : 'rgba(255,255,255,0.93)',
          backdropFilter: isHomeAtTop ? 'none' : 'blur(18px)',
          borderBottom: isHomeAtTop ? '1px solid transparent' : '1px solid #dfe7d4',
          transition: 'background-color 220ms ease, backdrop-filter 220ms ease, border-color 220ms ease',
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 72, md: 82 }, py: 1 }}>
            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 4, textDecoration: 'none' }}
              onClick={() => dispatch(resetFlow())}
            >
              <Logo size="small" />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: { md: 2, lg: 3 } }}>
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/aboutus' },
                { label: 'Products', path: '/products' },
                { label: 'Services', path: '/services' },
                { label: 'Programs', path: '/programs' },
                { label: 'Admission', path: '/admission' },
                { label: 'Career', path: '/career' },
                { label: 'Team', path: '/team' },
                { label: 'Contact', path: '/contact' }
              ].map((item) => (
                <Typography
                  key={item.label}
                  component={NavLink}
                  to={item.path}
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    opacity: 1,
                    '&:hover': { color: 'primary.dark', opacity: 1 },
                    pb: 0.5,
                    px: 0.5,
                    borderBottom: '2px solid transparent',
                    '&.active': {
                      borderBottom: '2px solid', borderColor: 'primary.main', color: 'primary.dark'
                    }
                  }}
                  onClick={item.label === 'Home' ? () => dispatch(resetFlow()) : undefined}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
              {currentPath === '/registration' && (
                <Translate
                  sx={{ color: 'primary.main', cursor: 'pointer', opacity: 0.8, '&:hover': { opacity: 1 } }}
                  onClick={handleOpenLanguageModal}
                />
              )}
              <Button
                component={Link}
                to="/registration"
                variant="outlined"
                sx={{
                  color: 'primary.dark',
                  borderColor: 'divider',
                  borderRadius: 3,
                  minHeight: 60,
                  px: 3.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'secondary.light' }
                }}
              >
                Get A Demo
              </Button>
              <Button
                component={Link}
                to="/registration"
                variant="contained"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: 3,
                  minHeight: 60,
                  px: 3.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: 'primary.dark' }
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
        position: 'relative',
        zIndex: 1,
        mb: { xs: 0, md: '90vh' }
      }}>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/aboutus" element={<AboutUsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/admission" element={<AdmissionPage />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Box>

      <Box sx={{
        position: { xs: 'relative', md: 'fixed' },
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0
      }}>
        <Footer />
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
      <ScrollToTop />
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
