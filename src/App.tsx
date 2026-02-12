import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress, AppBar, Toolbar, Container } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme/theme';
import Logo from './components/Logo';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const InfoPage = lazy(() => import('./pages/InfoPage'));
const OrganizationPage = lazy(() => import('./pages/OrganizationPage'));

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
            <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              Enterprise Solutions v3.0
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'background.default' }}>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/organization" element={<OrganizationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Box>

      <Box component="footer" sx={{ py: 4, textAlign: 'center', bgcolor: 'secondary.dark', color: 'white' }}>
        <Container maxWidth="lg">
          <Logo size="small" />
          <Box sx={{ opacity: 0.6, mt: 2, fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} EDXS Solutions. All rights reserved.
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <MainLayout />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
