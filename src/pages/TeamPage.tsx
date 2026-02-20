import React from 'react';
import { Box } from '@mui/material';
import TeamSection from '../components/landing/TeamSection';

const TeamPage: React.FC = () => {
    return (
        <Box sx={{ pt: { xs: 8, md: 10 }, minHeight: '100vh' }}>
            <TeamSection />
        </Box>
    );
};

export default TeamPage;
