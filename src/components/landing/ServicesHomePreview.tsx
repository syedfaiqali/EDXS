import React from 'react';
import { Box, Typography, Container, Grid, Button, alpha, keyframes } from '@mui/material';
import { Link } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import TrafficIcon from '@mui/icons-material/Traffic';
import VideocamIcon from '@mui/icons-material/Videocam';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const services = [
    {
        title: "Cyber Security",
        desc: "Advanced threat detection and encrypted data management for modern enterprise security.",
        icon: <SecurityIcon sx={{ fontSize: { xs: '2.2rem', md: '3.5rem' } }} />,
        color: '#76a345',
        gradient: 'linear-gradient(135deg, #76a345 0%, #5d8239 100%)'
    },
    {
        title: "Traffic Management",
        desc: "Smart city efficiency for regulatory workflows and automated digital licensing systems.",
        icon: <TrafficIcon sx={{ fontSize: { xs: '2.2rem', md: '3.5rem' } }} />,
        color: '#5d4037',
        gradient: 'linear-gradient(135deg, #5d4037 0%, #3e2b25 100%)'
    },
    {
        title: "CCTV Surveillance",
        desc: "Intelligent HD monitoring and AI-powered security ecosystems designed for schools.",
        icon: <VideocamIcon sx={{ fontSize: { xs: '2.2rem', md: '3.5rem' } }} />,
        color: '#76a345',
        gradient: 'linear-gradient(135deg, #76a345 0%, #5d8239 100%)'
    }
];

const ServicesHomePreview: React.FC = () => {
    return (
        <Box sx={{
            bgcolor: '#f0dbb0',
            py: { xs: 9, md: 15 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '10%',
                right: '-5%',
                width: 300,
                height: 300,
                borderRadius: '50%',
                bgcolor: alpha('#76a345', 0.1),
                filter: 'blur(80px)',
                animation: `${float} 10s infinite ease-in-out`
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '10%',
                left: '-5%',
                width: 250,
                height: 250,
                borderRadius: '50%',
                bgcolor: alpha('#5d4037', 0.1),
                filter: 'blur(60px)',
                animation: `${float} 8s infinite ease-in-out reverse`
            }
        }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <Box textAlign="center" mb={{ xs: 6, md: 10 }}>
                    <Typography
                        variant="h2"
                        fontWeight="900"
                        sx={{
                            fontSize: { xs: '2.15rem', sm: '2.6rem', md: '4rem' },
                            mb: { xs: 2, md: 3 },
                            color: '#5d4037',
                            textTransform: 'uppercase',
                            letterSpacing: -1
                        }}
                    >
                        Beyond <Box component="span" sx={{ color: '#76a345' }}>Management</Box>
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            maxWidth: 800,
                            mx: 'auto',
                            fontWeight: 500,
                            fontSize: { xs: '1rem', md: '1.2rem' },
                            color: 'rgba(93, 64, 55, 0.8)',
                            lineHeight: 1.6
                        }}
                    >
                        We provide the digital muscles for your infrastructure. From iron-clad security to
                        intelligent city-scale management systems.
                    </Typography>
                </Box>

                <Grid container spacing={{ xs: 2.5, sm: 3, md: 4 }} sx={{ mb: { xs: 6, md: 10 } }}>
                    {services.map((service, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Box sx={{
                                p: { xs: 3, sm: 3.5, md: 5 },
                                height: '100%',
                                bgcolor: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 6,
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                animation: `${fadeInUp} 0.8s ease-out forwards`,
                                animationDelay: `${index * 0.2}s`,
                                opacity: 1, // Changed to 1 for initial visibility or handled by animation
                                '&:hover': {
                                    transform: 'translateY(-15px)',
                                    bgcolor: 'white',
                                    boxShadow: '0 30px 60px rgba(93, 64, 55, 0.15)',
                                    '& .icon-box': {
                                        transform: 'scale(1.1) rotate(5deg)',
                                        background: service.gradient,
                                        color: 'white'
                                    }
                                }
                            }}>
                                <Box
                                    className="icon-box"
                                    sx={{
                                        mb: 3,
                                        color: service.color,
                                        bgcolor: alpha(service.color, 0.1),
                                        width: { xs: 74, sm: 82, md: 100 },
                                        height: { xs: 74, sm: 82, md: 100 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 4,
                                        transition: 'all 0.4s ease'
                                    }}
                                >
                                    {service.icon}
                                </Box>
                                <Typography variant="h4" fontWeight="900" gutterBottom color="#5d4037" sx={{ mb: 1.5, fontSize: { xs: '1.35rem', md: '2rem' } }}>
                                    {service.title}
                                </Typography>
                                <Typography sx={{ color: 'rgba(93, 64, 55, 0.7)', fontSize: { xs: '0.98rem', md: '1.1rem' }, lineHeight: 1.6 }}>
                                    {service.desc}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Box textAlign="center">
                    <Button
                        component={Link}
                        to="/services"
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            bgcolor: '#76a345',
                            color: 'white',
                            px: { xs: 4, sm: 6, md: 8 },
                            py: { xs: 1.7, md: 2.5 },
                            borderRadius: '50px',
                            fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.2rem' },
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: { xs: 0.4, md: 1 },
                            boxShadow: '0 15px 35px rgba(118,163,69,0.3)',
                            '&:hover': {
                                bgcolor: '#5d8239',
                                transform: 'scale(1.05)',
                                boxShadow: '0 20px 45px rgba(118,163,69,0.4)',
                            }
                        }}
                    >
                        View Full Capability
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default ServicesHomePreview;
