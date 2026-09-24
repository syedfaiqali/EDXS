import React, { useState, useEffect } from 'react';
import { Box, Zoom } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { pathname } = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

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
                    bottom: { xs: 24, md: 32 },
                    right: { xs: 16, md: 32 },
                    zIndex: 9999,
                    cursor: 'pointer',
                    bgcolor: 'white',
                    width: { xs: 48, md: 56 },
                    height: { xs: 48, md: 56 },
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
                        '& .scroll-to-top-icon': {
                            transform: 'translateY(-3px)'
                        }
                    }
                }}
            >
                <KeyboardArrowUp
                    className="scroll-to-top-icon"
                    sx={{
                        fontSize: '2.25rem',
                        color: 'primary.main',
                        transition: 'transform 0.25s ease'
                    }}
                />
            </Box>
        </Zoom>
    );
};

export default ScrollToTop;
