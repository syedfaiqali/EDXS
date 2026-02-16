import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const AboutUsHeader: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const observerVisible = useIntersectionObserver(sectionRef, { threshold: 0 });
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
            textAlign="center"
            mb={{ xs: 6, md: 8 }}
            sx={{
                position: 'relative',
                perspective: '1200px',
                px: { xs: 2, md: 4 },
                py: { xs: 5, md: 7 },
                borderRadius: 4,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f8ff 100%)',
                border: '1px solid rgba(14, 45, 74, 0.1)',
                boxShadow: '0 16px 40px rgba(14, 45, 74, 0.1)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                '@keyframes floatOne': {
                    '0%, 100%': { transform: 'rotateX(50deg) rotateZ(-18deg) translate3d(0, 0, 30px)' },
                    '50%': { transform: 'rotateX(50deg) rotateZ(-14deg) translate3d(0, -12px, 45px)' },
                },
                '@keyframes floatTwo': {
                    '0%, 100%': { transform: 'translate3d(0, 0, 40px)' },
                    '50%': { transform: 'translate3d(-8px, -14px, 55px)' },
                },
                '@keyframes contentRise': {
                    '0%': { opacity: 0, transform: 'translate3d(0, 18px, 0)' },
                    '100%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: { xs: 24, md: 34 },
                    left: { xs: 10, md: 28 },
                    width: { xs: 46, md: 70 },
                    height: { xs: 46, md: 70 },
                    borderRadius: 2,
                    background: 'linear-gradient(145deg, rgba(14, 45, 74, 0.24), rgba(14, 45, 74, 0.08))',
                    border: '1px solid rgba(14, 45, 74, 0.16)',
                    transform: 'rotateX(50deg) rotateZ(-18deg) translate3d(0, 0, 30px)',
                    boxShadow: '0 18px 28px rgba(14, 45, 74, 0.18)',
                    animation: 'floatOne 8s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    right: { xs: 16, md: 52 },
                    top: { xs: 30, md: 52 },
                    width: { xs: 34, md: 48 },
                    height: { xs: 34, md: 48 },
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, rgba(242, 184, 64, 0.46), rgba(242, 184, 64, 0.12))',
                    border: '1px solid rgba(242, 184, 64, 0.4)',
                    transform: 'translate3d(0, 0, 40px)',
                    boxShadow: '0 16px 24px rgba(242, 184, 64, 0.25)',
                    animation: 'floatTwo 7s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: -60,
                    left: -50,
                    width: 180,
                    height: 180,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(242, 184, 64, 0.24) 0%, rgba(242, 184, 64, 0) 72%)',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    right: -60,
                    bottom: -70,
                    width: 210,
                    height: 210,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(14, 45, 74, 0.2) 0%, rgba(14, 45, 74, 0) 72%)',
                    pointerEvents: 'none',
                }}
            />

            <Box
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    transformStyle: 'preserve-3d',
                    animation: isVisible ? 'contentRise 0.9s ease-out' : 'none',
                }}
            >
                <Typography
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 2.5,
                        py: 0.8,
                        mb: 2,
                        fontSize: { xs: '0.7rem', md: '0.78rem' },
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: '#0e2d4a',
                        borderRadius: 20,
                        bgcolor: 'rgba(14, 45, 74, 0.08)',
                        backdropFilter: 'blur(4px)',
                        transform: 'translateZ(40px)',
                    }}
                >
                    Academic Excellence
                </Typography>

                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 900,
                        color: '#0e2d4a',
                        lineHeight: 1.1,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem' },
                        mb: 2,
                        textShadow: '0 8px 20px rgba(14, 45, 74, 0.15)',
                        transform: 'translateZ(60px)',
                    }}
                >
                    About Our Institution
                </Typography>

                <Typography
                    sx={{
                        maxWidth: 760,
                        mx: 'auto',
                        mb: 3,
                        color: '#274764',
                        fontSize: { xs: '0.98rem', md: '1.1rem' },
                        lineHeight: 1.7,
                        transform: 'translateZ(30px)',
                    }}
                >
                    Learn how our educators, students, and community have built a culture of learning, innovation, and meaningful academic achievement.
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1.5,
                        transform: 'translateZ(35px)',
                    }}
                >
                    <Box sx={{ width: 30, height: 3, bgcolor: '#f2b840', borderRadius: 2 }} />
                    <Box sx={{ width: 90, height: 5, bgcolor: '#0e2d4a', borderRadius: 3 }} />
                    <Box sx={{ width: 30, height: 3, bgcolor: '#f2b840', borderRadius: 2 }} />
                </Box>
            </Box>
        </Box>
    );
};

export default AboutUsHeader;
