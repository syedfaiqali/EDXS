import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const AboutUsStory: React.FC = () => {
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
                position: 'relative',
                py: 16,
                px: 4,
                width: '100%',
                bgcolor: '#333', // Fallback
                backgroundImage: 'url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop)', // Placeholder school image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.6)', // Dark overlay
                }
            }}
        >
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 400, lineHeight: 1.6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                    "Our software was inspired by the frustration teachers in the independent sector experienced with school admin systems. We set out to create something better. And as our product grew in scope and scale, so did we."
                </Typography>
            </Box>
        </Box>
    );
};

export default AboutUsStory;
