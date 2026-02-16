import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const AboutUsMigration: React.FC = () => {
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
            sx={{
                py: 12,
                px: 4,
                width: '100%',
                bgcolor: '#1a4163', // Theme Blue for solid blue section
                color: 'white',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease'
            }}
        >
            <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
                    It's easier than you might think to migrate to Eduman
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 400, color: '#f0dbb0', mb: 6 }}>
                    And the potential is enormous.
                </Typography>
                <Box
                    component="button"
                    sx={{
                        bgcolor: '#edd8b4',
                        color: '#1a4163',
                        px: 6,
                        py: 2,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        border: '2px solid #edd8b4',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            bgcolor: 'transparent',
                            color: '#edd8b4',
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    Discover What's Possible
                </Box>
            </Box>
        </Box>
    );
};

export default AboutUsMigration;
