import React from 'react';
import { Box, Container } from '@mui/material';
import AboutUsHeader from '../about/AboutUsHeader';
import AboutUsStats from '../about/AboutUsStats';
import AboutUsTimeline from '../about/AboutUsTimeline';
import AboutUsStory from '../about/AboutUsStory';
import AboutUsMigration from '../about/AboutUsMigration';
import AboutUsBackground from '../about/AboutUsBackground';
// import AboutUsVideo from '../about/AboutUsVideo';

const AboutUsSection: React.FC = () => {
    return (
        <Box
            id="about-us"
            sx={{
                bgcolor: '#fff',
                position: 'relative',
                overflow: 'hidden',
                // Adding a soft top shadow to separate from Hero or previous section
                boxShadow: '0 -20px 100px rgba(0,0,0,0.02)',
            }}
        >
            {/* Global floating background elements for the entire About Us section */}
            <AboutUsBackground />

            <Box sx={{ pt: { xs: 8, md: 15 }, position: 'relative', zIndex: 1 }}>
                <Container maxWidth="xl">
                    <AboutUsHeader />
                    {/* <AboutUsVideo /> */}
                    <AboutUsStats />
                    <AboutUsTimeline />
                </Container>
            </Box>

            {/* Full Width Integrated Sections */}
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <AboutUsStory />
                <AboutUsMigration />
            </Box>
        </Box>
    );
};

export default AboutUsSection;
