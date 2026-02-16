import React from 'react';
import { Box, Container } from '@mui/material';
import AboutUsHeader from '../about/AboutUsHeader';
import AboutUsStats from '../about/AboutUsStats';
import AboutUsTimeline from '../about/AboutUsTimeline';
import AboutUsStory from '../about/AboutUsStory';
import AboutUsMigration from '../about/AboutUsMigration';

const AboutUsSection: React.FC = () => {
    return (
        <Box sx={{ bgcolor: '#f9f9f9', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ py: 10 }}>
                <Container maxWidth="xl">
                    <AboutUsHeader />
                    <AboutUsStats />
                    <AboutUsTimeline />
                </Container>
            </Box>

            {/* Full Width Sections */}
            <AboutUsStory />
            <AboutUsMigration />
        </Box>
    );
};

export default AboutUsSection;
