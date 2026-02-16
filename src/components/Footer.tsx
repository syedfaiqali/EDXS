import { Box, Container, Grid, IconButton, Typography } from '@mui/material';
import { Facebook, Instagram, LinkedIn, Mail, Phone, East } from '@mui/icons-material';
import Logo from './Logo';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#76a345', // Dark blue background similar to screenshot
                color: 'white',
                py: { xs: 8, md: 10 },
                position: 'relative',
                overflow: 'hidden',
                minHeight: { md: '90vh' }, // Match the margin in App.tsx
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center" justifyContent="space-between">
                    {/* Left Side: Logo and Social Icons */}
                    <Grid size={{ xs: 12, md: 5 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        {/* Large Shield Logo */}
                        <Box sx={{ mb: 4, display: 'inline-block' }}>
                            <Logo size="large" color="white" />
                        </Box>

                        {/* Social Icons Row */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            {[Facebook, Instagram, LinkedIn, Mail, Phone].map((Icon, index) => (
                                <IconButton
                                    key={index}
                                    sx={{
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            borderColor: 'white'
                                        },
                                        width: 40,
                                        height: 40
                                    }}
                                >
                                    <Icon fontSize="small" />
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Right Side: Let's Chat */}
                    <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: 'center', md: 'right' }, display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover .arrow-icon': {
                                    opacity: 1,
                                    transform: 'translateX(0)',
                                    maxWidth: '100px',
                                    ml: 2
                                }
                            }}
                        >
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    color: '#f0dbb0', // Tan color for text
                                    letterSpacing: -1,
                                    fontSize: { xs: '3rem', md: '5rem' },
                                    lineHeight: 1
                                }}
                            >
                                Let's Chat
                            </Typography>
                            <East
                                className="arrow-icon"
                                sx={{
                                    color: '#f0dbb0',
                                    fontSize: { xs: '3rem', md: '5rem' },
                                    opacity: 0,
                                    transform: 'translateX(-20px)',
                                    maxWidth: 0,
                                    overflow: 'hidden',
                                    ml: 0,
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer;
