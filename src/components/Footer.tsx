import { Box, Container, Grid, IconButton, Typography } from '@mui/material';
import { Facebook, Instagram, LinkedIn, Mail, Phone, East } from '@mui/icons-material';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Box
            component="footer"
            sx={{
                background: 'radial-gradient(circle at 20% 0%, #88b653 0%, #6f9c3f 45%, #5d8239 100%)',
                color: 'white',
                py: { xs: 6, md: 10 },
                position: 'relative',
                overflow: 'hidden',
                minHeight: { md: '90vh' }, // Match the margin in App.tsx
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" justifyContent="space-between">
                    {/* Left Side: Logo and Social Icons */}
                    <Grid size={{ xs: 12, md: 5 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        {/* Large Shield Logo */}
                        <Box sx={{ mb: { xs: 3, md: 4 }, display: 'inline-block' }}>
                            <Logo size="large" color="white" />
                        </Box>

                        {/* Social Icons Row */}
                        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                            {[
                                { Icon: Facebook, href: 'https://www.facebook.com/EduManSchoolManagement' },
                                { Icon: Instagram, href: 'https://www.instagram.com/Eduman_system/' },
                                { Icon: LinkedIn, href: 'https://www.linkedin.com/company/eduman/' },
                                { Icon: Mail, href: 'mailto:edxssystem@gmail.com' },
                                { Icon: Phone, href: 'tel:+923223440909' }
                            ].map((social, index) => (
                                <IconButton
                                    key={index}
                                    component="a"
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        color: 'white',
                                        bgcolor: 'rgba(255,255,255,0.08)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.18)',
                                            borderColor: 'white'
                                        },
                                        width: 40,
                                        height: 40
                                    }}
                                >
                                    <social.Icon fontSize="small" />
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Right Side: Let's Chat */}
                    <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: 'center', md: 'right' }, display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                        <Box
                            onClick={() => navigate('/contact')}
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
                                    fontSize: { xs: '2.4rem', sm: '3.2rem', md: '5rem' },
                                    lineHeight: 1
                                }}
                            >
                                Let's Chat
                            </Typography>
                            <East
                                className="arrow-icon"
                                sx={{
                                    color: '#f0dbb0',
                                    fontSize: { xs: '2.4rem', sm: '3.2rem', md: '5rem' },
                                    opacity: { xs: 1, md: 0 },
                                    transform: { xs: 'translateX(0)', md: 'translateX(-20px)' },
                                    maxWidth: { xs: '100px', md: 0 },
                                    overflow: 'hidden',
                                    ml: { xs: 1, md: 0 },
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
