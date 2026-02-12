import React from 'react';
import { Box, Typography } from '@mui/material';

const Logo: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'small' }) => {
    const isLarge = size === 'large';

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ position: 'relative', width: isLarge ? 60 : 40, height: isLarge ? 40 : 28 }}>
                {/* Top bar */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '80%',
                    height: '25%',
                    backgroundColor: '#76a345',
                    borderRadius: 2
                }} />
                {/* Middle bar with hook */}
                <Box sx={{
                    position: 'absolute',
                    top: '37%',
                    left: '20%',
                    width: '80%',
                    height: '25%',
                    backgroundColor: '#76a345',
                    borderRadius: 2
                }} />
                {/* Bottom bar */}
                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '70%',
                    height: '25%',
                    backgroundColor: '#76a345',
                    borderRadius: 2
                }} />
            </Box>
            <Box sx={{
                border: '1.5px solid #76a345',
                borderRadius: 1,
                px: 1,
                py: 0.2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography
                    sx={{
                        color: '#76a345',
                        fontWeight: 800,
                        fontSize: isLarge ? '1.5rem' : '1.1rem',
                        letterSpacing: -0.5
                    }}
                >
                    XS
                </Typography>
            </Box>
        </Box>
    );
};

export default Logo;
