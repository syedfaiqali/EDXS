import React from 'react';
import { Box, Container, Typography, Grid, TextField, Button } from '@mui/material';

const ContactPage: React.FC = () => {
    return (
        <Box sx={{ pt: 20, pb: 10, minHeight: '100vh', bgcolor: '#f9f9f9' }}>
            <Container maxWidth="md">
                <Typography variant="h1" sx={{ color: 'primary.main', mb: 4, fontWeight: 900, textAlign: 'center' }}>Contact Us</Typography>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary', fontWeight: 500, mb: 6, textAlign: 'center' }}>
                    Have questions? We'd love to hear from you. Send us a message and our team will get back to you shortly.
                </Typography>

                <Box component="form" sx={{ bgcolor: 'white', p: 4, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="First Name" variant="outlined" />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Last Name" variant="outlined" />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Email Address" variant="outlined" />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Message" variant="outlined" multiline rows={4} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button variant="contained" fullWidth size="large" sx={{ py: 2 }}>
                                Send Message
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default ContactPage;
