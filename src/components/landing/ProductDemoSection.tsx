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
                <Box textAlign="center" mb={6}>
                    <Typography variant="h3" fontWeight="900" color="#5d4037" gutterBottom sx={{ textTransform: 'uppercase' }}>
                        Experience <Box component="span" sx={{ color: '#76a345' }}>EDXS</Box> in Action
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(93, 64, 55, 0.8)', maxWidth: 700, mx: 'auto' }}>
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
                    height: { xs: 250, md: 450 }, // Balanced height for in-place play
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
                                    width: 100,
                                    height: 100,
                                    bgcolor: '#76a345',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 40px rgba(118,163,69,0.5)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': { transform: 'scale(1.1)' }
                                }}>
                                    <PlayArrowIcon sx={{ fontSize: '4rem', color: 'white', ml: 1 }} />
                                </Box>
                                <Typography sx={{ color: 'white', mt: 3, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
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
