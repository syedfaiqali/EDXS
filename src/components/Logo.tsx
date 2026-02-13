import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

const rotateY = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

const Logo: React.FC<{ size?: 'small' | 'large', color?: string }> = ({ size = 'small', color = 'white' }) => {
    const isLarge = size === 'large';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                    sx={{
                        color: color,
                        fontWeight: 900,
                        fontSize: isLarge ? '2.5rem' : '1.8rem',
                        letterSpacing: 1
                    }}
                >
                    ED
                </Typography>

                {/* Custom Shield/Hexagon Icon representing the 'O' replacement or brand mark */}
                <Box
                    sx={{
                        width: isLarge ? 40 : 28,
                        height: isLarge ? 45 : 32,
                        bgcolor: '#f0dbb0', // Tan color
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 0.5,
                        position: 'relative',
                        animation: `${rotateY} 6s linear infinite`,
                        perspective: '1000px'
                    }}
                >
                    <Box sx={{
                        width: '70%',
                        height: '70%',
                        bgcolor: color === 'white' ? '#76a345' : 'white', // Preserving user's green
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    }} />
                </Box>

                <Typography
                    sx={{
                        color: color,
                        fontWeight: 900,
                        fontSize: isLarge ? '2.5rem' : '1.8rem',
                        letterSpacing: 1
                    }}
                >
                    XS
                </Typography>
            </Box>
            <Typography
                sx={{
                    color: color,
                    opacity: 0.8,
                    fontSize: isLarge ? '0.7rem' : '0.5rem',
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    mt: -0.5,
                    width: '100%'
                }}
            >
                SCHOOL MANAGEMENT SYSTEM
            </Typography>
        </Box>
    );
};

export default Logo;
