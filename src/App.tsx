import React, { Suspense, useState, useEffect, useLayoutEffect, useRef } from 'react';
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
import ContactShortcuts from './components/ContactShortcuts';
import ChatbotWidget from './components/ChatbotWidget';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import useAdmissionRefresh from './hooks/useAdmissionRefresh';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


import LandingPage from './pages/LandingPage';
import DemoPage from './pages/DemoPage';
import AboutUsPage from './pages/AboutUsPage';
import ProductsPage from './pages/ProductsPage';
import ServicesPage from './pages/ServicesPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import ProgramsPage from './pages/ProgramsPage';
import AdmissionPage from './pages/AdmissionPage';
import CareerPage from './pages/CareerPage';
import ProgramDetailPage from './pages/ProgramDetailPage';
import CheckStatusPage from './pages/CheckStatusPage';

gsap.registerPlugin(ScrollTrigger);

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
  const pageAnimationRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const { language, setLanguage, t } = useLanguage();
  const dispatch = useDispatch();
  // One timer for the whole app, refreshing cached admissions data quietly.
  useAdmissionRefresh();
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

  useLayoutEffect(() => {
    const scope = pageAnimationRef.current;
    if (!scope) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        const select = gsap.utils.selector(scope);
        const text = select('h1, h2, h3, h4, h5, h6, p, .MuiTypography-root');
        const images = select('img, video, picture');
        const forms = select('form');
        const cards = select('.MuiCard-root, .MuiPaper-root');

        text.forEach((element) => {
          gsap.fromTo(element, { autoAlpha: 0, y: 18 }, {
            autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity,visibility',
            scrollTrigger: { trigger: element, start: 'top 92%', once: true }
          });
        });
        images.forEach((element) => {
          gsap.fromTo(element, { autoAlpha: 0, scale: 0.96 }, {
            autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity,visibility',
            scrollTrigger: { trigger: element, start: 'top 92%', once: true }
          });
        });
        [...forms, ...cards].forEach((element) => {
          gsap.fromTo(element, { autoAlpha: 0, y: 22 }, {
            autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity,visibility',
            scrollTrigger: { trigger: element, start: 'top 92%', once: true }
          });
        });
      }, scope);

      return () => context.revert();
    });

    return () => media.revert();
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
          bgcolor: isHomeAtTop ? 'transparent' : 'rgba(255,255,255,0.86)',
          backdropFilter: isHomeAtTop ? 'none' : 'blur(18px)',
          borderBottom: isHomeAtTop ? '1px solid transparent' : '1px solid rgba(111,150,63,0.12)',
          boxShadow: isHomeAtTop ? 'none' : '0 8px 28px rgba(24,35,52,0.08)',
          transition: 'background-color 280ms ease, backdrop-filter 280ms ease, border-color 280ms ease, box-shadow 280ms ease',
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 46,
                    lineHeight: 1,
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

              {/* Sits apart from the section links above because it is a task
                  rather than a destination, but is styled to read as one of them. */}
              <Typography
                component={NavLink}
                to="/check-status"
                variant="body2"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 46,
                  lineHeight: 1,
                  pb: 0.5,
                  px: 0.5,
                  borderBottom: '2px solid transparent',
                  '&:hover': { color: 'primary.dark' },
                  '&.active': {
                    borderBottom: '2px solid', borderColor: 'primary.main', color: 'primary.dark'
                  }
                }}
              >
                Check Status
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 2, lg: 2.5 }, ml: { md: 2, lg: 3 }, flexShrink: 0 }}>
              {currentPath === '/free-trial' && (
                <Translate
                  sx={{ color: 'primary.main', cursor: 'pointer', opacity: 0.8, '&:hover': { opacity: 1 } }}
                  onClick={handleOpenLanguageModal}
                />
              )}
              <Button
                component={Link}
                to="/demo"
                variant="outlined"
                sx={{
                  color: isHomeAtTop ? '#fff' : 'primary.main',
                  borderColor: isHomeAtTop ? 'rgba(255,255,255,0.7)' : 'rgba(111,150,63,0.35)',
                  borderRadius: 3,
                  minHeight: 46,
                  px: 2.75,
                  textTransform: 'none',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  transition: 'color 280ms ease, border-color 280ms ease, background-color 280ms ease',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'secondary.light', color: 'primary.main' }
                }}
              >
                Get A Demo
              </Button>
              <Button
                component={Link}
                to="/free-trial"
                variant="contained"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: 3,
                  minHeight: 46,
                  px: 2.75,
                  textTransform: 'none',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                Request a Demo
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
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            ref={pageAnimationRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
          <Suspense fallback={<LoadingScreen />}>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/registration" element={<Navigate to="/demo" replace />} />
            <Route path="/demo" element={<DemoPage />} />
            {/* Kept for existing links, but demo requests never create an ERP login. */}
            <Route path="/free-trial" element={<DemoPage />} />
            <Route path="/aboutus" element={<AboutUsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/admission" element={<AdmissionPage />} />
            <Route path="/admission/intake/:registerId" element={<ProgramDetailPage />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/check-status" element={<CheckStatusPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
          </motion.div>
        </AnimatePresence>
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
                onChange={(e) => setTempLang(e.target.value as 'English' | 'Urdu' | 'Arabic')}
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
      <ChatbotWidget />
      <ContactShortcuts />
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
