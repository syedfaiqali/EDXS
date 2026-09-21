import React from 'react';
import { Box } from '@mui/material';
import CareerSection from '../components/landing/CareerSection';

const CareerPage: React.FC = () => {
    return (
        <Box sx={{ pt: { xs: 8, md: 12 }, minHeight: '100vh' }}>
            <CareerSection />
        </Box>
    );
};

export default CareerPage;
