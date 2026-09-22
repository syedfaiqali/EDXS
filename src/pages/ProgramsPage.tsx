import React from 'react';
import { Box } from '@mui/material';
import ProgramsSection from '../components/landing/ProgramsSection';

const ProgramsPage: React.FC = () => {
    return (
        <Box sx={{ pt: { xs: 8, md: 7 }, minHeight: '100vh' }}>
            <ProgramsSection />
        </Box>
    );
};

export default ProgramsPage;
