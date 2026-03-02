import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, keyframes } from '@mui/material';
import graphImg from '../../assets/graph.webp';

const reveal = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const WhyEduman: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const mainTitle = 'Why EDXS?';
    const subTitle = 'Grow Seamlessly with Ease';
    const bodyText = "Welcome to EDXS - where we're more than just a management tool, we're your partners in education. Effortlessly handle student enrollment, timetables, and budgets with a click. With EDXS, customization is key, tailored to your school's unique needs. Moreover, our dedicated support ensures smooth sailing even through rough waters. Join us in charting a course towards academic excellence. So, why choose EDXS? Because together, we're charting a course towards a brighter future for education. Come aboard, and let's navigate this journey together!";

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box
            sx={{
                bgcolor: '#f0dbb0',
                pt: { xs: 9, md: 15 },
                pb: { xs: 7, md: 8 },
                px: { xs: 3, sm: 5, md: '10%' },
                color: '#76a345',
                position: 'relative',
                zIndex: 1
            }}
        >
            <Box textAlign="center" mb={{ xs: 5, md: 10 }}>
                <Typography variant="h2" fontWeight="800" sx={{ fontSize: { xs: '2.1rem', sm: '2.6rem', md: '3.5rem' } }}>
                    {mainTitle.split('').map((char, i) => (
                        <Box
                            key={i}
                            component="span"
                            sx={{
                                display: 'inline-block',
                                opacity: 0,
                                animation: isVisible ? `${reveal} 0.5s ease forwards` : 'none',
                                animationDelay: `${i * 0.05}s`
                            }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </Box>
                    ))}
                </Typography>
            </Box>
            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        sx={{
                            width: '100%',
                            height: { xs: 220, sm: 280, md: 350 },
                            bgcolor: 'rgba(255,255,255,0.55)',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.7)',
                            boxShadow: '0 24px 45px rgba(53, 72, 30, 0.18)',
                            opacity: 0,
                            animation: isVisible ? `${reveal} 0.8s ease forwards` : 'none'
                        }}
                    >
                        <Box
                            component="img"
                            src={graphImg}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                            }}
                        />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4" fontWeight="800" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, textAlign: { xs: 'center', md: 'left' } }}>
                        {subTitle.split('').map((char, i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    opacity: 0,
                                    animation: isVisible ? `${reveal} 0.5s ease forwards` : 'none',
                                    animationDelay: `${(mainTitle.length * 0.05) + (i * 0.03)}s`
                                }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </Box>
                        ))}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            lineHeight: { xs: 1.75, md: 1.8 },
                            fontSize: { xs: '0.98rem', sm: '1.03rem', md: '1.08rem' },
                            opacity: 0.95,
                            p: { xs: 2.5, sm: 3, md: 0 },
                            borderRadius: { xs: 3, md: 0 },
                            bgcolor: { xs: 'rgba(255,255,255,0.45)', md: 'transparent' }
                        }}
                    >
                        {bodyText.split(' ').map((word, i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    opacity: 0,
                                    animation: isVisible ? `${reveal} 0.5s ease forwards` : 'none',
                                    animationDelay: `${(mainTitle.length * 0.05) + (subTitle.length * 0.03) + (i * 0.02)}`,
                                    mr: '0.25em'
                                }}
                            >
                                {word}
                            </Box>
                        ))}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default WhyEduman;
