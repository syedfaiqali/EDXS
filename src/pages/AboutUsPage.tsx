import React from 'react';
import { Box, Container } from '@mui/material';
import AboutUsSection from '../components/landing/AboutUsSection';

const AboutUsPage: React.FC = () => {
    return (
        <Box sx={{ pt: 12, minHeight: '100vh', bgcolor: '#f9f9f9' }}>
            <Container maxWidth="xl">
                <AboutUsSection />
            </Container>
        </Box>
    );
};

export default AboutUsPage;
