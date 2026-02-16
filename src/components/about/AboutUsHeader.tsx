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
        <Box ref={sectionRef} textAlign="center" mb={8} sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease'
        }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#1a4163', mb: 2 }}>
                About Us
            </Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: '#76a345', mx: 'auto', borderRadius: 2 }} />
        </Box>
    );
};

export default AboutUsHeader;
