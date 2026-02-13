import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const WhyEduman: React.FC = () => {
    return (
        <Box sx={{ bgcolor: '#edd8b4', pt: 15, pb: 5, px: "10%", color: '#76a345', position: 'relative', zIndex: 1 }}>
            <Box textAlign="center" mb={10}>
                <Typography variant="h2" fontWeight="800" sx={{ fontSize: '3.5rem' }}>Why EDXS?</Typography>
            </Box>
            <Grid container spacing={8} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{
                        width: '100%',
                        height: 350,
                        bgcolor: 'rgba(35,92,139,0.05)',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, px: 4 }}>
                            {[40, 60, 80, 100, 120, 140].map((h, i) => (
                                <Box key={i} sx={{ width: 40, height: h, bgcolor: '#76a345', borderRadius: '4px 4px 0 0' }} />
                            ))}
                        </Box>
                        <ArrowForward sx={{
                            position: 'absolute',
                            bottom: 100,
                            right: 100,
                            fontSize: 100,
                            color: '#f0dbb0',
                            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))',
                            transform: 'rotate(-45deg)'
                        }} />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4" fontWeight="800" gutterBottom>Grow Seamlessly with Ease</Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', opacity: 0.9 }}>
                        Welcome to EDXS – where we're more than just a management tool, we're your partners in education. Effortlessly handle student enrollment, timetables, and budgets with a click. With EDXS, customization is key, tailored to your school's unique needs. Moreover, our dedicated support ensures smooth sailing even through rough waters. Join us in charting a course towards academic excellence. So, why choose EDXS? Because together, we're charting a course towards a brighter future for education. Come aboard, and let's navigate this journey together!
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default WhyEduman;
