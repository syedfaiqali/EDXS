import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import xsLogo from '../assets/xs_square_light.png';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;

const Logo: React.FC<{ size?: 'small' | 'large', color?: string }> = ({ size = 'small', color = 'white' }) => {
    const isLarge = size === 'large';

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: isLarge ? 2.5 : 1.5,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: isLarge ? 64 : 44,
                    height: isLarge ? 64 : 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: `${float} 3s ease-in-out infinite`,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                    '& img': {
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: isLarge ? '12px' : '8px'
                    }
                }}
            >
                <img src={xsLogo} alt="EDXS Logo" />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <Typography
                        sx={{
                            color: color,
                            fontWeight: 900,
                            fontSize: isLarge ? '2.4rem' : '1.8rem',
                            lineHeight: 1,
                            letterSpacing: -0.5,
                            textTransform: 'uppercase',
                        }}
                    >
                        ED
                    </Typography>
                    <Typography
                        sx={{
                            color: color === 'white' ? '#f0dbb0' : '#76a345',
                            fontWeight: 400,
                            fontSize: isLarge ? '2.4rem' : '1.8rem',
                            lineHeight: 1,
                            letterSpacing: -0.5,
                            textTransform: 'uppercase',
                            ml: 0.1
                        }}
                    >
                        XS
                    </Typography>
                </Box>
                {/* <Typography
                    sx={{
                        color: color,
                        opacity: 0.85,
                        fontSize: isLarge ? '0.75rem' : '0.55rem',
                        fontWeight: 700,
                        letterSpacing: isLarge ? 3 : 2,
                        mt: 0.2,
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap'
                    }}
                >
                    School Management System
                </Typography> */}
            </Box>
        </Box>
    );
};

export default Logo;
