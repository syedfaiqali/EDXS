import React from 'react';
import { Box } from '@mui/material';
import ContactSection from '../components/landing/ContactSection';

const ContactPage: React.FC = () => {
    return (
        <Box sx={{ pt: { xs: 8, md: 10 }, minHeight: '100vh' }}>
            <ContactSection />
        </Box>
    );
};

export default ContactPage;
