import React from 'react';
import { Box } from '@mui/material';
import navbarLogo from '../assets/edxs-navbar-logo.png';

const Logo: React.FC<{ size?: 'small' | 'large', color?: string }> = ({ size = 'small' }) => {
    const isLarge = size === 'large';

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <Box
                sx={{
                    width: isLarge ? 195 : 130,
                    height: isLarge ? 81 : 58,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& img': {
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                    }
                }}
            >
                <img src={navbarLogo} alt="EDXS" />
            </Box>
        </Box>
    );
};

export default Logo;
