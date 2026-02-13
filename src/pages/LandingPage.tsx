import React, { useState, useEffect } from 'react';
import { Box, Container, keyframes, Typography } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';

// Components
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import WhyEduman from '../components/landing/WhyEduman';
import HowItWorks from '../components/landing/HowItWorks';
import TestimonialsSection from '../components/landing/TestimonialsSection';

// --- Keyframes ---
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.2; }
  50% { opacity: 0.5; }
  90% { opacity: 0.2; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const flow = keyframes`
  0% { stroke-dashoffset: 80; }
  100% { stroke-dashoffset: 0; }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 0.6; }
`;

const LandingPage: React.FC = () => {
    const [logoStage, setLogoStage] = useState<'waiting' | 'opening' | 'finished'>('waiting');
    const { t } = useLanguage();

    useEffect(() => {
        // Logo animation trigger
        const openTimer = setTimeout(() => setLogoStage('opening'), 1000);
        const finishTimer = setTimeout(() => setLogoStage('finished'), 2500);

        return () => {
            clearTimeout(openTimer);
            clearTimeout(finishTimer);
        };
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#76a345', position: 'relative', overflow: 'hidden' }}>
            {/* Animated Background Elements */}
            {[...Array(15)].map((_, i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        left: `${Math.random() * 100}%`,
                        bottom: -100,
                        width: Math.random() * 60 + 20,
                        height: Math.random() * 60 + 20,
                        bgcolor: i % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(240, 219, 176, 0.05)',
                        borderRadius: i % 3 === 0 ? '50%' : '8px',
                        animation: `${float} ${Math.random() * 10 + 10}s linear infinite`,
                        animationDelay: `${Math.random() * 20}s`,
                        zIndex: 0
                    }}
                />
            ))}

            {/* Logo animation overlay */}
            {logoStage !== 'finished' && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: '#76a345',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: logoStage === 'waiting' ? 1 : 0,
                    transition: 'opacity 1s ease'
                }}>
                    <Box sx={{ display: 'flex', position: 'relative' }}>
                        <Typography variant="h1" sx={{
                            fontSize: '15rem',
                            fontWeight: 900,
                            color: '#fff',
                            letterSpacing: -10,
                            mr: logoStage === 'opening' ? 10 : 0,
                            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                            ED
                        </Typography>
                        <Box sx={{
                            width: logoStage === 'opening' ? 10 : 0,
                            bgcolor: '#f0dbb0', // separator bar in tan
                            height: '100%',
                            transition: 'all 1s ease',
                            mx: logoStage === 'opening' ? 2 : 0
                        }} />
                        <Typography variant="h1" sx={{
                            fontSize: '15rem',
                            fontWeight: 900,
                            color: '#fff',
                            letterSpacing: -10,
                            ml: logoStage === 'opening' ? 10 : 0,
                            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                            XS
                        </Typography>
                    </Box>
                </Box>
            )}

            <Box sx={{
                opacity: (logoStage === 'opening' || logoStage === 'finished') ? 1 : 0,
                transform: (logoStage === 'opening' || logoStage === 'finished') ? 'scale(1)' : 'scale(0.9)',
                transition: 'all 1s ease 0.5s',
                position: 'relative',
                zIndex: 10,
                pt: 12
            }}>
                <Container maxWidth="lg">
                    <HeroSection />
                    <StatsSection />
                </Container>

                {/* Scroll Down Arrow / Triangle Pointer */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: { xs: 4, md: 6 },
                    position: 'relative',
                    zIndex: 20,
                    mb: -3 // overlap with cream section
                }}>
                    <Box sx={{
                        width: 45,
                        height: 25,
                        bgcolor: 'primary.main',
                        clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                    }} />
                </Box>

                <WhyEduman />

                {/* Connection Squiggle Bridge 1: WhyEduman -> HowItWorks */}
                <Box sx={{
                    position: 'relative',
                    bgcolor: '#edd8b4',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 5,
                    overflow: 'visible',
                    mt: -6,
                    mb: -4
                }}>
                    <Box sx={{ width: '100%', maxWidth: 800, height: 200, position: 'relative' }}>
                        <svg width="100%" height="100%" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Base Rope with moving brown dots */}
                            <path
                                d="M150 0 C 180 80, 250 180, 380 140 C 430 110, 480 110, 440 50 C 400 -10, 460 20, 500 100 C 550 170, 700 120, 750 200"
                                stroke="#5d4037"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeDasharray="2 12"
                                opacity="0.6"
                                style={{ animation: `${flow} 2s linear infinite` }}
                            />
                            {/* Traveling Highlight */}
                            <path
                                d="M150 0 C 180 80, 250 180, 380 140 C 430 110, 480 110, 440 50 C 400 -10, 460 30, 500 100 C 550 170, 700 120, 750 200"
                                stroke="#f0dbb0"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray="40 160" // Long pulse
                                opacity="0.8"
                                style={{ animation: `${flow} 1.2s linear infinite` }}
                            />
                        </svg>

                        <Box sx={{
                            position: 'absolute',
                            top: '35%',
                            left: '52%',
                            color: '#5d4037',
                            fontSize: '1.8rem',
                            animation: `${pulse} 2s ease-in-out infinite`
                        }}>★</Box>
                    </Box>
                </Box>

                <HowItWorks />

                {/* Connection Squiggle Bridge 2: HowItWorks -> Testimonials */}
                <Box sx={{
                    position: 'relative',
                    bgcolor: '#edd8b4',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 5,
                    overflow: 'visible',
                    mt: -10,
                    mb: -4
                }}>
                    <Box sx={{ width: '100%', maxWidth: 800, height: 200, position: 'relative' }}>
                        <svg width="100%" height="100%" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Base Rope with moving brown dots */}
                            <path
                                d="M650 0 C 600 50, 450 150, 350 100 C 300 80, 250 80, 280 130 C 310 180, 240 180, 200 120 C 150 60, 50 100, 10 180"
                                stroke="#5d4037"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeDasharray="2 12"
                                opacity="0.6"
                                style={{ animation: `${flow} 2s linear infinite` }}
                            />
                            {/* Traveling Highlight */}
                            <path
                                d="M650 0 C 600 50, 450 150, 350 100 C 300 80, 250 80, 280 130 C 310 180, 240 180, 200 120 C 150 60, 50 100, 10 180"
                                stroke="#76a345"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray="40 160"
                                opacity="0.8"
                                style={{ animation: `${flow} 1.2s linear infinite` }}
                            />
                        </svg>

                        <Box sx={{
                            position: 'absolute',
                            top: '45%',
                            left: '35%',
                            color: '#76a345',
                            fontSize: '1.5rem',
                            animation: `${pulse} 2.5s ease-in-out infinite`
                        }}>★</Box>
                    </Box>
                </Box>

                <TestimonialsSection />
            </Box>
        </Box >
    );
};

export default LandingPage;
