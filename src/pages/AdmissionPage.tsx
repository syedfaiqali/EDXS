import React from 'react';
import { Box } from '@mui/material';
import AdmissionSection from '../components/landing/AdmissionSection';

const AdmissionPage: React.FC = () => {
    return (
        <Box sx={{ pt: { xs: 8, md: 12 }, minHeight: '100vh' }}>
            <AdmissionSection />
        </Box>
    );
};

export default AdmissionPage;
