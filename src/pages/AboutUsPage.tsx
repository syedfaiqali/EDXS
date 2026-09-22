import React from 'react';
import { Box } from '@mui/material';
import AboutUsSection from '../components/landing/AboutUsSection';

const AboutUsPage: React.FC = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7ef' }}>
            <AboutUsSection />
        </Box>
    );
};

export default AboutUsPage;
