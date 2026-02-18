import React, { useState } from 'react';
import { Box, Container, Typography, alpha } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import serviceVideo from '../../assets/service.mov';
import posterImg from '../../assets/graph.webp';

const AboutUsVideo: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <Container maxWidth="lg" sx={{ mb: 15 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" fontWeight="900" color="#5d4037" gutterBottom sx={{ textTransform: 'uppercase' }}>
                    See Our <Box component="span" sx={{ color: '#76a345' }}>Impact</Box>
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(93, 64, 55, 0.8)', maxWidth: 700, mx: 'auto' }}>
                    Watch how EDXS is revolutionizing educational workflows and empowering
                    institutions to achieve more every single day.
                </Typography>
            </Box>

            <Box sx={{
                position: 'relative',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 40px 100px rgba(0,0,0,0.12)',
                maxWidth: 900,
                mx: 'auto',
                aspectRatio: '16 / 9',
                bgcolor: 'black',
                cursor: isPlaying ? 'default' : 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover .play-button': { transform: 'scale(1.1)', bgcolor: '#76a345' },
                '&:hover .poster-overlay': { bgcolor: 'rgba(0,0,0,0.3)' }
            }}>
                {!isPlaying ? (
                    <Box sx={{ width: '100%', height: '100%', position: 'relative' }} onClick={() => setIsPlaying(true)}>
                        <Box
                            component="img"
                            src={posterImg}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'brightness(0.8)'
                            }}
                        />
                        <Box
                            className="poster-overlay"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'rgba(0,0,0,0.15)',
                                transition: 'all 0.4s ease'
                            }}
                        >
                            <Box
                                className="play-button"
                                sx={{
                                    width: 100,
                                    height: 100,
                                    bgcolor: alpha('#76a345', 0.9),
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 40px rgba(118,163,69,0.3)',
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}
                            >
                                <PlayArrowIcon sx={{ fontSize: '4.5rem', color: 'white', ml: 1 }} />
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <Box
                        component="video"
                        src={serviceVideo}
                        controls
                        autoPlay
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'block'
                        }}
                    />
                )}
            </Box>
        </Container>
    );
};

export default AboutUsVideo;
