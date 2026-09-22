import React, { useEffect, useRef } from 'react';
import { Box, Typography, Grid, Button, Container, keyframes } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../assets/HeroImage.webp';

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
`;

const rotateY = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const reveal = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeroSection: React.FC = () => {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const curveLayerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const hero = heroRef.current;
        const curveLayer = curveLayerRef.current;

        if (!hero || !curveLayer) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frameId: number | null = null;

        const updateCurvePosition = () => {
            frameId = null;

            if (reducedMotion.matches) {
                curveLayer.style.setProperty('--hero-curve-translate', '0px');
                return;
            }

            const heroStart = window.scrollY + hero.getBoundingClientRect().top;
            const progress = Math.min(
                1,
                Math.max(0, (window.scrollY - heroStart) / Math.max(hero.offsetHeight, 1))
            );

            curveLayer.style.setProperty('--hero-curve-translate', `${-progress * hero.offsetHeight * 0.12}px`);
        };

        const requestCurveUpdate = () => {
            if (frameId === null) frameId = window.requestAnimationFrame(updateCurvePosition);
        };

        updateCurvePosition();
        window.addEventListener('scroll', requestCurveUpdate, { passive: true });
        window.addEventListener('resize', requestCurveUpdate);
        reducedMotion.addEventListener('change', requestCurveUpdate);

        return () => {
            window.removeEventListener('scroll', requestCurveUpdate);
            window.removeEventListener('resize', requestCurveUpdate);
            reducedMotion.removeEventListener('change', requestCurveUpdate);
            if (frameId !== null) window.cancelAnimationFrame(frameId);
        };
    }, []);

    const titleText = "Let EDXS Take the Strain";
    const subText = "We've revolutionized the way schools operate, taking the strain out of management tasks so educators can focus on what truly matters: nurturing young minds.";

    return (
        <Box ref={heroRef} sx={{
            bgcolor: '#f5f7ef',
            color: 'text.primary',
            pt: { xs: 17, md: 19 },
            pb: { xs: 8, md: 10 },
            position: 'relative',
            overflow: 'hidden',
            minHeight: { md: 728 },
            backgroundImage: `linear-gradient(90deg, rgba(245,247,239,0.98) 0%, rgba(245,247,239,0.94) 47%, rgba(245,247,239,0.68) 61%, rgba(245,247,239,0.16) 75%, rgba(245,247,239,0) 88%), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }} sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h1" sx={{
                        fontSize: { xs: '3rem', md: '4.5rem' },
                        fontWeight: 800,
                        mb: 3,
                        lineHeight: 1.1,
                        color: '#76a345'
                    }}>
                        {titleText.split(' ').map((word, wordIndex) => {
                            const startIndex = titleText.indexOf(word);

                            return (
                            <Box
                                key={`${word}-${wordIndex}`}
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    whiteSpace: 'nowrap',
                                    mr: wordIndex === titleText.split(' ').length - 1 ? 0 : '0.28em'
                                }}
                            >
                                {word.split('').map((char, charIndex) => (
                                    <Box
                                        key={`${char}-${charIndex}`}
                                        component="span"
                                        sx={{
                                            display: 'inline-block',
                                            opacity: 0,
                                            animation: `${reveal} 0.5s ease forwards`,
                                            animationDelay: `${(startIndex + charIndex) * 0.05}s`
                                        }}
                                    >
                                        {char}
                                    </Box>
                                ))}
                            </Box>
                            );
                        })}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 5, fontWeight: 500, maxWidth: '90%', lineHeight: 1.65 }}>
                        {subText.split(' ').map((word, i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    opacity: 0,
                                    animation: `${reveal} 0.5s ease forwards`,
                                    animationDelay: `${(titleText.length * 0.05) + (i * 0.1)}s`,
                                    mr: '0.25em'
                                }}
                            >
                                {word}
                            </Box>
                        ))}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/contact')}
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: 3,
                            px: 5,
                            py: 2,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        Start 10 Day Trial
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'none', justifyContent: 'center', position: 'relative' }}>
                    <Box sx={{
                        width: '100%',
                        maxWidth: 500,
                        height: 500,
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {/* The Large Shield with trailing lines */}
                        <Box sx={{
                            position: 'relative',
                            animation: `${float} 4s ease-in-out infinite`
                        }}>
                            {/* Trailing Lines */}
                            {[...Array(4)].map((_, i) => (
                                <Box key={i} sx={{
                                    position: 'absolute',
                                    bottom: -150,
                                    left: 40 + (i * 45),
                                    width: 3,
                                    height: 180,
                                    background: 'linear-gradient(to bottom, rgba(111,150,63,.38), transparent)',
                                    opacity: 0.4
                                }} />
                            ))}

                            {/* Main Hexagon/Shield Shape */}
                            <Box sx={{
                                width: 220,
                                height: 260,
                                bgcolor: '#dce9cb',
                                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                zIndex: 2,
                                animation: `${rotateY} 8s linear infinite`,
                                perspective: '1000px'
                            }}>
                                <Box sx={{
                                    width: '85%',
                                    height: '85%',
                                    bgcolor: 'primary.main',
                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                }} />
                            </Box>

                            {/* Decorative Stars around the shield */}
                            {[
                                { top: -20, left: -40, speed: 8 },
                                { top: 100, left: -80, speed: 12 },
                                { top: 220, left: 100, speed: 10 },
                                { top: 200, left: 240, speed: 15 },
                                { top: 50, left: 260, speed: 9 },
                                { top: -30, left: 180, speed: 11 },
                            ].map((pos, i) => (
                                <Box key={i} sx={{
                                    position: 'absolute',
                                    top: pos.top,
                                    left: pos.left,
                                    color: '#96b96d',
                                    fontSize: i % 2 === 0 ? '1.5rem' : '1rem',
                                    opacity: 0.8,
                                    textShadow: '0 0 10px rgba(150,185,109,0.35)',
                                    animation: `${rotate} ${pos.speed}s linear infinite`
                                }}>★</Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            </Container>
            <Box
                ref={curveLayerRef}
                aria-hidden="true"
                sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 'calc(100% - var(--hero-wave-height))',
                height: 'calc(100% + var(--hero-wave-height) + 4px)',
                '--hero-wave-height': { xs: '80px', md: '150px' },
                '--hero-curve-translate': '0px',
                transform: 'translate3d(0, var(--hero-curve-translate), 0)',
                transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'transform',
                zIndex: 2,
                pointerEvents: 'none',
                lineHeight: 0,
                '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none'
                }
            }}>
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '100%', height: 'var(--hero-wave-height)', display: 'block' }}>
                    <path
                        fill="#e9efdd"
                        d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,128C672,107,768,117,864,138.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                </svg>
                <Box sx={{ position: 'absolute', top: 'calc(var(--hero-wave-height) - 1px)', left: 0, right: 0, bottom: 0, bgcolor: '#e9efdd' }} />
            </Box>
        </Box>
    );
};

export default HeroSection;
