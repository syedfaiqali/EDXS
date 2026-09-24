import React, { Suspense, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, NavLink } from 'react-router-dom';
import {
  ThemeProvider, CssBaseline, Box, CircularProgress, AppBar, Toolbar, Container,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, Typography, Drawer, IconButton, List, ListItemButton, ListItemText
} from '@mui/material';
import { Translate, Menu, Close } from '@mui/icons-material';
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
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
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

  const navigationItems = [
    { label: 'Home', path: '/' }, { label: 'About Us', path: '/aboutus' },
    { label: 'Products', path: '/products' }, { label: 'Services', path: '/services' },
    { label: 'Admission', path: '/admission' }, { label: 'Career', path: '/career' },
    { label: 'Team', path: '/team' }, { label: 'Contact', path: '/contact' },
    { label: 'Check Status', path: '/check-status' }
  ];

  const closeNavigation = () => setIsNavigationOpen(false);



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
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: { xs: 1, lg: 4 }, textDecoration: 'none' }}
              onClick={() => dispatch(resetFlow())}
            >
              <Logo size="small" />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' }, justifyContent: 'center', gap: 1.5 }}>
              {navigationItems.slice(0, -1).map((item) => (
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5, lg: 2.5 }, ml: { xs: 'auto', lg: 3 }, flexShrink: 0 }}>
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
                  display: { xs: 'none', sm: 'inline-flex' },
                  color: isHomeAtTop ? '#fff' : 'primary.main',
                  borderColor: isHomeAtTop ? 'rgba(255,255,255,0.7)' : 'rgba(111,150,63,0.35)',
                  borderRadius: 3,
                  minHeight: 46,
                  px: 2.75,
                  textTransform: 'none',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
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
                  display: { xs: 'none', sm: 'inline-flex' },
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: 3,
                  minHeight: 46,
                  px: 2.75,
                  textTransform: 'none',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                Request a Demo
              </Button>
              <IconButton
                aria-label="Open navigation menu"
                onClick={() => setIsNavigationOpen(true)}
                sx={{ display: { xs: 'inline-flex', lg: 'none' }, minWidth: 46, minHeight: 46, color: isHomeAtTop ? 'white' : 'primary.main', border: '1px solid', borderColor: isHomeAtTop ? 'rgba(255,255,255,.55)' : 'rgba(111,150,63,.35)' }}
              >
                <Menu />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={isNavigationOpen}
        onClose={closeNavigation}
        // The support shortcuts use a deliberately high z-index. Keep the
        // navigation sheet above them so it remains a clean, focused menu.
        sx={{ zIndex: 10002 }}
        PaperProps={{ sx: { width: 'min(88vw, 360px)', p: 2, bgcolor: 'background.default' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Logo size="small" />
          <IconButton aria-label="Close navigation menu" onClick={closeNavigation} sx={{ minWidth: 44, minHeight: 44 }}><Close /></IconButton>
        </Box>
        <List disablePadding sx={{ mb: 2 }}>
          {navigationItems.map((item) => (
            <ListItemButton key={item.path} component={NavLink} to={item.path} onClick={() => { if (item.path === '/') dispatch(resetFlow()); closeNavigation(); }} sx={{ borderRadius: 2, minHeight: 48, mb: .5, '&.active': { bgcolor: 'secondary.main', color: 'primary.dark' } }}>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          ))}
        </List>
        <Button component={Link} to="/free-trial" variant="contained" fullWidth onClick={closeNavigation} sx={{ minHeight: 48 }}>Request a Demo</Button>
      </Drawer>

      <Box component="main" sx={{
        flexGrow: 1,
        backgroundColor: 'background.default',
        position: 'relative',
        zIndex: 1,
        // Leave exactly one footer-height of scroll space on every screen so
        // the fixed footer is revealed beneath the page, including mobile.
        mb: '90vh'
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
        position: 'fixed',
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
