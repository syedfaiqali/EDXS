import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const TeamPage: React.FC = () => {
    return (
        <Box sx={{ pt: 20, minHeight: '100vh', bgcolor: '#f9f9f9' }}>
            <Container maxWidth="lg">
                <Typography variant="h1" sx={{ color: 'primary.main', mb: 4, fontWeight: 900 }}>Our Team</Typography>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary', fontWeight: 500 }}>
                    Our team of elite educators and technology experts are dedicated to transforming the educational landscape.
                    Biographies and profiles of আমাদের visionaries will be available shortly.
                </Typography>
            </Container>
        </Box>
    );
};

export default TeamPage;
