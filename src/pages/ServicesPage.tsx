import React from 'react';
import { Box } from '@mui/material';
import ServicesSection from '../components/landing/ServicesSection';

const ServicesPage: React.FC = () => {
    return (
        <Box sx={{ pt: { xs: 8, md: 12 }, minHeight: '100vh' }}>
            <ServicesSection />
        </Box>
    );
};

export default ServicesPage;
