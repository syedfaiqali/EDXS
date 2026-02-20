import React from 'react';
import { Box } from '@mui/material';
import AboutUsSection from '../components/landing/AboutUsSection';

const AboutUsPage: React.FC = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9' }}>
            <AboutUsSection />
        </Box>
    );
};

export default AboutUsPage;
