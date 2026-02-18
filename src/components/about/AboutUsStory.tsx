import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, keyframes } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

const visualFloat = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
`;

const AboutUsStory: React.FC = () => {
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
                py: { xs: 12, md: 24 },
                bgcolor: 'primary.main',
                overflow: 'hidden',
                color: 'white',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 1s ease 0.2s',
            }}
        >
            {/* Particle Overlay */}
            {[...Array(15)].map((_, i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        width: Math.random() * 4 + 2,
                        height: Math.random() * 4 + 2,
                        bgcolor: 'secondary.main',
                        borderRadius: '50%',
                        opacity: 0.3,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `${visualFloat} ${Math.random() * 5 + 5}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                />
            ))}

            {/* Background Decorative Elements */}
            <Box sx={{
                position: 'absolute', top: '-10%', right: '-5%', width: '50%', height: '120%',
                background: 'linear-gradient(135deg, rgba(90, 125, 52, 0) 0%, rgba(90, 125, 52, 1) 100%)',
                zIndex: 0
            }} />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={10} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ position: 'relative' }}>
                            <FormatQuoteIcon sx={{ fontSize: '8rem', color: 'secondary.main', opacity: 0.3, position: 'absolute', top: -60, left: -40 }} />
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 900, fontSize: { xs: '2.5rem', md: '4.5rem' }, lineHeight: 1.1, mb: 4, letterSpacing: '-0.04em'
                                }}
                            >
                                Built for <br />
                                <Box component="span" sx={{ color: 'secondary.main' }}>Innovation,</Box> <br />
                                By Experts.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: { xs: '1.2rem', md: '1.8rem' }, mb: 6, lineHeight: 1.5, opacity: 0.9, fontWeight: 500
                                }}
                            >
                                Powered by a dynamic group of companies with 300+ man-years of collective software expertise, we deliver high-performance digital solutions across industries. Our platform was born from a passion for precision and a deep understanding of complex organizational needs.
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer', '&:hover .play-icon': { transform: 'scale(1.1) rotate(10deg)' } }}>
                                <PlayCircleFilledWhiteIcon className="play-icon" sx={{ fontSize: '4.5rem', color: 'secondary.main', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>Watch Our Mission</Typography>
                                    <Typography sx={{ opacity: 0.7 }}>Experience the EDXS difference (2:14 min)</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Box sx={{
                                position: 'relative', zIndex: 2, borderRadius: 10, overflow: 'hidden',
                                boxShadow: '0 50px 100px rgba(0,0,0,0.3)',
                                animation: `${visualFloat} 6s ease-in-out infinite`
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop"
                                    alt="Education Vision"
                                    style={{ width: '100%', display: 'block' }}
                                />
                                <Box sx={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    background: 'linear-gradient(transparent, rgba(118, 163, 69, 0.4))'
                                }} />
                            </Box>

                            {/* Floating decorative elements */}
                            <Box sx={{
                                position: 'absolute', top: -30, right: -30, width: 120, height: 120,
                                bgcolor: 'secondary.main', borderRadius: 4, zIndex: 1, opacity: 0.8,
                                animation: `${visualFloat} 5s ease-in-out infinite reverse`
                            }} />
                            <Box sx={{
                                position: 'absolute', bottom: -50, left: -50, width: 250, height: 250,
                                border: '2px solid rgba(240, 219, 176, 0.4)', borderRadius: '50%', zIndex: 1,
                                animation: `${visualFloat} 8s ease-in-out infinite`
                            }} />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AboutUsStory;
