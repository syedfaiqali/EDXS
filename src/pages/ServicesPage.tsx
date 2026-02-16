import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const ServicesPage: React.FC = () => {
    return (
        <Box sx={{ pt: 20, minHeight: '100vh', bgcolor: '#f9f9f9' }}>
            <Container maxWidth="lg">
                <Typography variant="h1" sx={{ color: 'primary.main', mb: 4, fontWeight: 900 }}>Our Services</Typography>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary', fontWeight: 500 }}>
                    We are currently refining our service offerings to provide you with the best educational management experience.
                    Please check back soon for a detailed list of our premium services.
                </Typography>
            </Container>
        </Box>
    );
};

export default ServicesPage;
