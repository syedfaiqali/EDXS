import React, { useRef, useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const AboutUsStats: React.FC = () => {
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

    const stats = [
        { val: '200+', label: 'Schools & Groups', accent: '#0e2d4a' },
        { val: '7', label: 'Countries', accent: '#1f6f8b' },
        { val: '80+', label: 'Employees', accent: '#f2b840' },
        { val: '1.4M', label: 'Students', accent: '#2e7d32' },
    ];

    return (
        <Box
            ref={sectionRef}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
                py: { xs: 3.5, md: 5 },
                px: { xs: 2, md: 3 },
                mb: 8,
                background: 'linear-gradient(180deg, #eef3f8 0%, #e7edf5 100%)',
                borderTop: '3px solid #0e2d4a',
                borderBottom: '1px solid rgba(14, 45, 74, 0.12)',
                boxShadow: '0 10px 24px rgba(14, 45, 74, 0.08)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
                '@keyframes statRise': {
                    '0%': { opacity: 0, transform: 'translate3d(0, 18px, 0)' },
                    '100%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, rgba(14, 45, 74, 0.03) 0%, rgba(242, 184, 64, 0.06) 50%, rgba(14, 45, 74, 0.03) 100%)',
                    pointerEvents: 'none',
                }}
            />

            <Grid container spacing={0} justifyContent="center" alignItems="center">
                {stats.map((stat, i) => (
                    <Grid
                        item
                        xs={6}
                        md={3}
                        key={i}
                        sx={{
                            textAlign: 'center',
                            borderRight: { md: i !== stats.length - 1 ? '1px solid rgba(14, 45, 74, 0.14)' : 'none' },
                            borderBottom: { xs: i < 2 ? '1px solid rgba(14, 45, 74, 0.12)' : 'none', md: 'none' },
                        }}
                    >
                        <Box
                            sx={{
                                px: { xs: 1.2, md: 1.8 },
                                py: { xs: 2.2, md: 1.4 },
                                animation: isVisible ? `statRise 0.55s ease-out ${0.15 + i * 0.12}s both` : 'none',
                                transition: 'transform 0.25s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    color: stat.accent,
                                    mb: 0.7,
                                    fontSize: { xs: '2rem', md: '3rem' },
                                    lineHeight: 1.1,
                                    textShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
                                }}
                            >
                                {stat.val}
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#36556f',
                                    fontWeight: 600,
                                    fontSize: { xs: '1rem', md: '1.05rem' },
                                }}
                            >
                                {stat.label}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AboutUsStats;
