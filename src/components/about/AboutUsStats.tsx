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
        { val: '200+', label: 'Schools & Groups', color: '#1a4163' }, // Theme Blue
        { val: '7', label: 'Countries', color: '#8e44ad' },
        { val: '80+', label: 'Employees', color: '#e67e22' },
        { val: '1.4M', label: 'Students', color: '#76a345' },
    ];

    return (
        <Box
            ref={sectionRef}
            sx={{
                bgcolor: '#e0e0e0', // Light grey bar
                py: 6,
                px: 4,
                mb: 10,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s'
            }}
        >
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                {stats.map((stat, i) => (
                    <Grid item xs={6} md={3} key={i} sx={{ textAlign: 'center', borderRight: { md: i !== 3 ? '1px solid #ccc' : 'none' } }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color, mb: 1 }}>
                            {stat.val}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#555', fontWeight: 500 }}>
                            {stat.label}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AboutUsStats;
