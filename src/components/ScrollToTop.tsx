import React, { useState, useEffect } from 'react';
import { Box, Zoom } from '@mui/material';
import xsLogo from '../assets/xs_square_light.png';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <Zoom in={isVisible}>
            <Box
                onClick={scrollToTop}
                role="presentation"
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    zIndex: 9999,
                    cursor: 'pointer',
                    bgcolor: 'white',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    border: '1px solid rgba(118, 163, 69, 0.1)',
                    '&:hover': {
                        transform: 'translateY(-5px) scale(1.1)',
                        boxShadow: '0 12px 40px rgba(118, 163, 69, 0.2)',
                        '& img': {
                            transform: 'rotate(5deg) scale(1.1)'
                        }
                    }
                }}
            >
                <Box
                    component="img"
                    src={xsLogo}
                    alt="Scroll to top"
                    sx={{
                        width: 32,
                        height: 32,
                        objectFit: 'contain',
                        transition: 'transform 0.4s ease'
                    }}
                />
            </Box>
        </Zoom>
    );
};

export default ScrollToTop;
