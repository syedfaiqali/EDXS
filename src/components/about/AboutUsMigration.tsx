import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, keyframes } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(240, 219, 176, 0.2); }
  50% { box-shadow: 0 0 50px rgba(240, 219, 176, 0.5); }
`;

const AboutUsMigration: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const observerVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });
    const [forceVisible, setForceVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setForceVisible(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const isVisible = observerVisible || forceVisible;

    return (
        <Box
            ref={sectionRef}
            sx={{
                py: { xs: 16, md: 24 },
                width: '100%',
                bgcolor: '#5a7d34',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(100px)',
                transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
        >
            {/* Background pattern */}
            <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1,
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'
            }} />

            <Container maxWidth="xl">
                <Grid container spacing={10} alignItems="center">
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                <RocketLaunchIcon sx={{ fontSize: '3rem', color: 'secondary.main' }} />
                                <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.3em', color: 'secondary.main' }}>
                                    READY FOR LAUNCH
                                </Typography>
                            </Box>

                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 900, mb: 4, fontSize: { xs: '3rem', md: '5.5rem' },
                                    lineHeight: 0.9, letterSpacing: '-0.04em'
                                }}
                            >
                                Seamless Transition. <br />
                                <Box component="span" sx={{ color: 'secondary.main', opacity: 0.9 }}>Absolute Efficiency.</Box>
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: '1.2rem', md: '1.6rem' }, fontWeight: 500,
                                    color: 'rgba(255,255,255,0.8)', mb: 8, maxWidth: 650
                                }}
                            >
                                Migrating from legacy systems shouldn't be a headache. Our expert team
                                ensures your data, staff, and students are onboarded with zero downtime.
                            </Typography>

                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: 'secondary.main', color: 'primary.main', px: 10, py: 3,
                                    borderRadius: 4, fontSize: '1.4rem', fontWeight: 900,
                                    textTransform: 'none', animation: `${pulseGlow} 3s infinite`,
                                    '&:hover': { bgcolor: 'white', transform: 'scale(1.05) translateY(-5px)' }
                                }}
                            >
                                Get Started Today
                            </Button>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{
                            p: 6, borderRadius: 10, bgcolor: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.2)', position: 'relative'
                        }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 6, textAlign: 'center' }}>
                                The Migration Roadmap
                            </Typography>

                            {[
                                'Full Data Integrity Analysis',
                                'Automated Staff Role Mapping',
                                'Secure Student Data Porting',
                                '24/7 Dedicated Concierge Support'
                            ].map((step, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                                    <CheckCircleOutlineIcon sx={{ color: 'secondary.main', fontSize: '2.5rem' }} />
                                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 700 }}>{step}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AboutUsMigration;
