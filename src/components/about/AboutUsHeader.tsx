import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Chip, keyframes } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const shimmer = keyframes`
  0% { transform: translateX(-100%) skewX(-20deg); }
  50% { transform: translateX(100%) skewX(-20deg); }
  100% { transform: translateX(100%) skewX(-20deg); }
`;

const morph = keyframes`
  0% { border-radius: 40% 60% 60% 40% / 40% 30% 70% 60%; }
  50% { border-radius: 60% 40% 40% 60% / 60% 70% 30% 40%; }
  100% { border-radius: 40% 60% 60% 40% / 40% 30% 70% 60%; }
`;

const AboutUsHeader: React.FC = () => {
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
                position: 'relative',
                textAlign: 'center',
                mb: { xs: 8, md: 10 },
                px: { xs: 2, md: 4 },
                py: { xs: 10, md: 16 },
                borderRadius: 12,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 40px 120px rgba(118, 163, 69, 0.1)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
        >
            {/* Animated Mesh Blobs */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '40%',
                    height: '60%',
                    background: 'radial-gradient(circle, rgba(118, 163, 69, 0.15) 0%, rgba(118, 163, 69, 0) 70%)',
                    animation: `${morph} 8s ease-in-out infinite`,
                    filter: 'blur(40px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '35%',
                    height: '55%',
                    background: 'radial-gradient(circle, rgba(240, 219, 176, 0.2) 0%, rgba(240, 219, 176, 0) 70%)',
                    animation: `${morph} 10s ease-in-out infinite reverse`,
                    filter: 'blur(40px)',
                }}
            />

            <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 1000, mx: 'auto' }}>
                <Box sx={{ display: 'inline-flex', position: 'relative', mb: 5 }}>
                    <Chip
                        label="THE NEXT GENERATION"
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 900,
                            letterSpacing: '0.25em',
                            px: 3,
                            py: 1,
                            height: 'auto',
                            borderRadius: '100px',
                            boxShadow: '0 10px 20px rgba(118, 163, 69, 0.3)',
                            overflow: 'hidden',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                animation: `${shimmer} 3s infinite`,
                            }
                        }}
                    />
                </Box>

                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 900,
                        fontSize: { xs: '3rem', sm: '4.5rem', md: '6.5rem' },
                        mb: 4,
                        lineHeight: 0.85,
                        letterSpacing: '-0.04em',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box component="span" sx={{
                        color: 'text.primary',
                        opacity: 0.9
                    }}>
                        Crafted for
                    </Box>
                    <Box component="span" sx={{
                        background: 'linear-gradient(135deg, #76a345 0%, #5a7d34 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        position: 'relative',
                        mt: 1,
                        filter: 'drop-shadow(0 15px 30px rgba(118, 163, 69, 0.2))'
                    }}>
                        Excellence.
                    </Box>
                </Typography>

                <Typography
                    sx={{
                        maxWidth: 700,
                        mx: 'auto',
                        color: 'text.secondary',
                        fontSize: { xs: '1.2rem', md: '1.6rem' },
                        lineHeight: 1.5,
                        fontWeight: 500,
                        mb: 8,
                        letterSpacing: '-0.01em',
                        opacity: 0.8
                    }}
                >
                    We’re not just building software; we’re architecting the digital infrastructure
                    for the schools of tomorrow.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                    {[...Array(3)].map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: i === 1 ? 60 : 12,
                                height: 8,
                                borderRadius: 4,
                                bgcolor: i === 1 ? 'primary.main' : 'rgba(118, 163, 69, 0.2)',
                                boxShadow: i === 1 ? '0 0 15px rgba(118, 163, 69, 0.4)' : 'none',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default AboutUsHeader;
