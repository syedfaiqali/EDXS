import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, keyframes } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const reveal = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const grow = keyframes`
  from { height: 0; }
  to { height: var(--final-height); }
`;

const WhyEduman: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const mainTitle = "Why EDXS?";
    const subTitle = "Grow Seamlessly with Ease";
    const bodyText = "Welcome to EDXS – where we're more than just a management tool, we're your partners in education. Effortlessly handle student enrollment, timetables, and budgets with a click. With EDXS, customization is key, tailored to your school's unique needs. Moreover, our dedicated support ensures smooth sailing even through rough waters. Join us in charting a course towards academic excellence. So, why choose EDXS? Because together, we're charting a course towards a brighter future for education. Come aboard, and let's navigate this journey together!";

    const barHeights = [40, 60, 80, 100, 120, 140];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{ bgcolor: '#edd8b4', pt: 15, pb: 5, px: "10%", color: '#76a345', position: 'relative', zIndex: 1 }}>
            <Box textAlign="center" mb={10}>
                <Typography variant="h2" fontWeight="800" sx={{ fontSize: '3.5rem' }}>
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
            <Grid container spacing={8} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{
                        width: '100%',
                        height: 350,
                        bgcolor: 'rgba(35,92,139,0.05)',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, px: 4 }}>
                            {barHeights.map((h, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        width: 40,
                                        height: 0,
                                        bgcolor: '#76a345',
                                        borderRadius: '4px 4px 0 0',
                                        '--final-height': `${h}px`,
                                        animation: isVisible ? `${grow} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards` : 'none',
                                        animationDelay: `${0.2 + (i * 0.1)}s`
                                    }}
                                />
                            ))}
                        </Box>
                        <ArrowForward sx={{
                            position: 'absolute',
                            bottom: 100,
                            right: 100,
                            fontSize: 100,
                            color: '#f0dbb0',
                            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))',
                            transform: 'rotate(-45deg)',
                            opacity: 0,
                            animation: isVisible ? `${reveal} 1s ease forwards` : 'none',
                            animationDelay: `${0.2 + (barHeights.length * 0.1)}s`
                        }} />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4" fontWeight="800" gutterBottom>
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
                    <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', opacity: 0.9 }}>
                        {bodyText.split(' ').map((word, i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    opacity: 0,
                                    animation: isVisible ? `${reveal} 0.5s ease forwards` : 'none',
                                    animationDelay: `${(mainTitle.length * 0.05) + (subTitle.length * 0.03) + (i * 0.02)}s`,
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
