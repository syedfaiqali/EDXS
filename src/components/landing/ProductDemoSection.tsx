import React, { useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import demoVideo from '../../assets/AI School Management Solutions.webm';
import posterImg from '../../assets/graph.webp';

const ProductDemoSection: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <Box sx={{ bgcolor: '#f0dbb0', py: { xs: 8, md: 12 }, overflow: 'hidden' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
                    <Typography
                        variant="h3"
                        fontWeight="900"
                        color="#5d4037"
                        gutterBottom
                        sx={{ textTransform: 'uppercase', fontSize: { xs: '1.9rem', sm: '2.2rem', md: '3rem' }, letterSpacing: { xs: -0.3, md: 0 } }}
                    >
                        Experience <Box component="span" sx={{ color: '#76a345' }}>EDXS</Box> in Action
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(93, 64, 55, 0.8)', maxWidth: 700, mx: 'auto', fontSize: { xs: '1rem', md: '1.2rem' } }}>
                        Take a deep dive into our AI-driven ecosystem and see how we're transforming
                        educational management across the globe.
                    </Typography>
                </Box>

                <Box sx={{
                    position: 'relative',
                    borderRadius: 6,
                    overflow: 'hidden',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                    maxWidth: 800,
                    mx: 'auto',
                    border: '1px solid rgba(255,255,255,0.6)',
                    height: { xs: 220, sm: 290, md: 450 }, // Balanced height for in-place play
                    bgcolor: 'black',
                    cursor: isPlaying ? 'default' : 'pointer',
                    '&:hover .play-overlay': { opacity: 1 },
                    '&:hover .poster-img': { transform: 'scale(1.05)' }
                }}>
                    {!isPlaying ? (
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }} onClick={() => setIsPlaying(true)}>
                            {/* Poster/Thumbnail */}
                            <Box
                                component="img"
                                src={posterImg}
                                className="poster-img"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.8s ease',
                                    filter: 'brightness(0.7)'
                                }}
                            />

                            {/* Play Button Overlay */}
                            <Box
                                className="play-overlay"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'rgba(0,0,0,0.2)',
                                    transition: 'all 0.4s ease'
                                }}
                            >
                                <Box sx={{
                                    width: { xs: 74, sm: 86, md: 100 },
                                    height: { xs: 74, sm: 86, md: 100 },
                                    bgcolor: '#76a345',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 40px rgba(118,163,69,0.5)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': { transform: 'scale(1.1)' }
                                }}>
                                    <PlayArrowIcon sx={{ fontSize: { xs: '2.6rem', sm: '3.1rem', md: '4rem' }, color: 'white', ml: { xs: 0.5, md: 1 } }} />
                                </Box>
                                <Typography sx={{ color: 'white', mt: { xs: 2, md: 3 }, fontWeight: 800, textTransform: 'uppercase', letterSpacing: { xs: 1, md: 2 }, fontSize: { xs: '0.8rem', sm: '0.95rem', md: '1rem' } }}>
                                    Watch Product Tour
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Box
                            component="video"
                            src={demoVideo}
                            controls
                            autoPlay
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                bgcolor: 'black'
                            }}
                        />
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default ProductDemoSection;
