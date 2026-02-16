import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import ProductsSection from './components/landing/ProductsSection';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

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
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleNavigation = (item: string) => {
    if (item === 'Home') {
      navigate('/');
      dispatch(resetFlow());
    } else if (item === 'About Us') {
      navigate('/aboutus');
    } else if (item === 'Products') {
      navigate('/products');
    } else if (item === 'Services') {
      navigate('/services');
    } else if (item === 'Team') {
      navigate('/team');
    } else if (item === 'Contact') {
      navigate('/contact');
    }
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
                    borderBottom: (
                      (item === 'Home' && location.pathname === '/') ||
                      (item === 'About Us' && location.pathname.startsWith('/aboutus')) ||
                      (item === 'Products' && location.pathname.startsWith('/products')) ||
                      (item === 'Services' && location.pathname.startsWith('/services')) ||
                      (item === 'Team' && location.pathname.startsWith('/team'))
                    ) ? '2px solid white' : 'none',
                    pb: 0.5,
                    px: 0.5
                  }}
                  onClick={() => handleNavigation(item)}
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
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: { xs: 'none', lg: 'block' },
                  fontWeight: location.pathname === '/contact' ? 800 : 500,
                  textDecoration: location.pathname === '/contact' ? 'underline' : 'none'
                }}
                onClick={() => handleNavigation('Contact')}
              >
                Contact us
              </Typography>
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
