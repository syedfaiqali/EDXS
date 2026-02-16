import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Grid, Typography, keyframes } from '@mui/material';

const reveal = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const EDXSPartnerSection: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const titleText = "Become An EDXS Partner";
    const descText = "Empower education together! Collaborate with us as an EDXS Partner and access customized resources to drive positive change in learning.";

    useEffect(() => {
        // Trigger animation on mount
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{ bgcolor: '#edd8b4', py: { xs: 8, md: 12 }, overflow: 'hidden' }}>
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    {/* Left Side: Content */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                fontWeight: 800,
                                color: '#76a345', // Dark blue from screenshot
                                mb: 3,
                                fontSize: { xs: '2.5rem', md: '3.5rem' }
                            }}
                        >
                            {titleText.split('').map((char, i) => (
                                <Box
                                    key={i}
                                    component="span"
                                    sx={{
                                        display: 'inline-block',
                                        opacity: 0,
                                        animation: isVisible ? `${reveal} 0.5s ease forwards` : 'none',
                                        animationDelay: `${i * 0.04}s`
                                    }}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </Box>
                            ))}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#333',
                                mb: 4,
                                fontSize: '1.1rem',
                                lineHeight: 1.6,
                                maxWidth: '90%'
                            }}
                        >
                            {descText.split(' ').map((word, i) => (
                                <Box
                                    key={i}
                                    component="span"
                                    sx={{
                                        display: 'inline-block',
                                        opacity: 0,
                                        animation: isVisible ? `${reveal} 0.5s ease forwards` : 'none',
                                        animationDelay: `${(titleText.length * 0.04) + (i * 0.05)}s`,
                                        mr: '0.25em'
                                    }}
                                >
                                    {word}
                                </Box>
                            ))}
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: '#76a345',
                                color: '#333',
                                px: 4,
                                py: 1.5,
                                border: '2px solid #edd8b4',
                                borderRadius: 50,
                                fontWeight: 700,
                                fontSize: '1rem',
                                opacity: 0,
                                animation: isVisible ? `${reveal} 0.6s ease forwards` : 'none',
                                animationDelay: `${(titleText.length * 0.04) + (descText.split(' ').length * 0.05) + 0.2}s`,
                                '&:hover': {
                                    borderColor: '#dcc6a0'
                                },
                                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                            }}
                        >
                            Explore Partnership Benefits
                        </Button>
                    </Grid>

                    {/* Right Side: Illustration */}
                    <Grid size={{ xs: 12, md: 6 }} sx={{
                        opacity: 0,
                        animation: isVisible ? `${reveal} 0.8s ease forwards` : 'none',
                        animationDelay: `${(titleText.length * 0.04) + (descText.split(' ').length * 0.05) + 0.4}s`
                    }}>
                        <Box sx={{ position: 'relative', height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {/* Abstract World Map Background (Simplified opacity layer) */}
                            <svg
                                width="100%"
                                height="100%"
                                viewBox="0 0 600 400"
                                style={{ position: 'absolute', top: 0, left: 0, opacity: 0.1, zIndex: 0 }}
                            >
                                {/* Simple outline of a map shape or abstract geometric pattern */}
                                <path
                                    d="M50 150 Q 150 50, 250 150 T 450 150 T 550 250"
                                    fill="none"
                                    stroke="#5d4037"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M100 300 Q 200 200, 300 300 T 500 300"
                                    fill="none"
                                    stroke="#5d4037"
                                    strokeWidth="2"
                                />
                                {/* Using a world map path would be huge, staying with abstract pattern fitting the theme */}
                            </svg>

                            {/* Main Composition */}
                            <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
                                <svg width="100%" height="100%" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Rising Graph Arrow */}
                                    <path
                                        d="M50,350 L200,200 L280,250 L450,50"
                                        stroke="#76a345"
                                        strokeWidth="40"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M450,50 L450,150 M450,50 L350,50"
                                        stroke="#76a345"
                                        strokeWidth="40"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                                {/* Document Icon Overlay */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    bgcolor: 'white',
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                    textAlign: 'center',
                                    width: 180
                                }}>
                                    {/* Logo Placeholder */}
                                    <Box sx={{ width: 40, height: 40, border: '4px solid #1a3e72', borderRadius: '50%', mx: 'auto', mb: 2, borderBottom: 'none' }} />

                                    {/* Lines */}
                                    <Box sx={{ height: 4, width: '100%', bgcolor: '#333', mb: 1, borderRadius: 1 }} />
                                    <Box sx={{ height: 4, width: '80%', bgcolor: '#333', mb: 1, borderRadius: 1 }} />
                                    <Box sx={{ height: 4, width: '90%', bgcolor: '#333', mb: 3, borderRadius: 1 }} />

                                    {/* Signature Line */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                        <Box sx={{ height: 2, width: '60%', bgcolor: '#999' }} />
                                        <Box sx={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: '50%',
                                            border: '2px solid #e53935',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#e53935',
                                            fontWeight: 'bold',
                                            fontSize: 10
                                        }}>
                                            ✓
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Hand signing (simplified with CSS/Box) */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: '65%',
                                    left: '58%',
                                    transform: 'rotate(-45deg)',
                                    zIndex: 10
                                }}>
                                    {/* Pen */}
                                    <Box sx={{ width: 80, height: 8, bgcolor: '#333', borderRadius: 4 }} />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default EDXSPartnerSection;
