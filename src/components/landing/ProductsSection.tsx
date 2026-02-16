import React, { useRef } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ApiIcon from '@mui/icons-material/Api';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PaymentsIcon from '@mui/icons-material/Payments';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import HubIcon from '@mui/icons-material/Hub';

interface ProductItemProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    reverse?: boolean;
    bgColor?: string;
    accentColor?: string;
}

const ProductRow: React.FC<ProductItemProps> = ({ title, description, icon, reverse, bgColor, accentColor }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(rowRef, { threshold: 0.2 });

    return (
        <Box
            ref={rowRef}
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: reverse ? 'row-reverse' : 'row' },
                alignItems: 'stretch',
                minHeight: { md: 500 },
                overflow: 'hidden',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
        >
            {/* Image/Icon Side */}
            <Box
                sx={{
                    flex: 1,
                    bgcolor: bgColor || '#fdfdfd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    p: 8,
                }}
            >
                <Box
                    sx={{
                        width: { xs: 200, sm: 250, md: 300 },
                        height: { xs: 200, sm: 250, md: 300 },
                        borderRadius: '50%',
                        border: `8px solid ${accentColor || '#76a345'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'white',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
                        zIndex: 1,
                    }}
                >
                    {React.isValidElement(icon)
                        ? React.cloneElement(icon as React.ReactElement<any>, {
                            sx: { fontSize: { xs: '5rem', md: '8rem' }, color: accentColor || '#76a345' }
                        })
                        : icon}
                </Box>
                {/* Decorative background circle */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: '80%',
                        height: '80%',
                        border: '1px dashed rgba(118, 163, 69, 0.2)',
                        borderRadius: '50%',
                        animation: 'rotateCircle 20s linear infinite',
                        '@keyframes rotateCircle': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' }
                        }
                    }}
                />
            </Box>

            {/* Text Content Side */}
            <Box
                sx={{
                    flex: 1.2,
                    bgcolor: reverse ? 'primary.main' : '#f0dbb0',
                    color: reverse ? 'white' : 'primary.main',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: { xs: 6, md: 10 },
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em', fontSize: { xs: '2rem', md: '3rem' } }}>
                    {title}
                </Typography>
                <Typography sx={{ fontSize: '1.2rem', lineHeight: 1.6, opacity: 0.9, mb: 4, fontWeight: 500 }}>
                    {description}
                </Typography>
                <Button
                    variant="text"
                    endIcon={<KeyboardArrowRightIcon />}
                    sx={{
                        alignSelf: 'flex-start',
                        color: reverse ? 'secondary.main' : 'primary.main',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        '&:hover': {
                            transform: 'translateX(10px)',
                            bgcolor: 'rgba(0,0,0,0.05)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Read More
                </Button>
            </Box>
        </Box>
    );
};

const ProductsSection: React.FC = () => {
    const products = [
        {
            title: 'EduMart',
            description: 'A comprehensive marketplace targeted to the students of schools, colleges, and universities. All products and vendors on EduMart are carefully selected to cater to the needs of our global audience.',
            icon: <ShoppingBagIcon />,
            accentColor: '#76a345',
            bgColor: '#f9fbf7'
        },
        {
            title: 'EduPay',
            description: 'Facilitates seamless payments within the Eduman platform, allowing schools to manage fees, tuition, and other financial transactions with absolute efficiency and security.',
            icon: <PaymentsIcon />,
            reverse: true,
            accentColor: '#f0dbb0'
        },
        {
            title: 'Eduman Lite',
            description: 'Provides schools with a practical and budget-friendly solution for managing essential administrative tasks, enabling them to operate more efficiently while keeping costs under control.',
            icon: <FlashOnIcon />,
            accentColor: '#5a7d34',
            bgColor: '#f0f4ea'
        },
        {
            title: 'Incendio Hub',
            description: 'A comprehensive suite of digital services designed to enhance school online presence, engage audiences, and achieve institutional goals effectively in the digital age.',
            icon: <HubIcon />,
            reverse: true,
            accentColor: '#76a345'
        }
    ];

    return (
        <Box id="products" sx={{ bgcolor: 'white', overflow: 'hidden' }}>
            {/* API Section Header */}
            <Box sx={{ py: 15, bgcolor: '#f0dbb0', textAlign: 'center' }}>
                <Container maxWidth="md">
                    <ApiIcon sx={{ fontSize: '4rem', color: 'primary.main', mb: 3 }} />
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            color: 'primary.main',
                            mb: 4,
                            lineHeight: 1.1,
                            fontSize: { xs: '2.5rem', md: '4rem' }
                        }}
                    >
                        Unified API <br />
                        <Box component="span" sx={{ opacity: 0.7 }}>Integration Ecosystem</Box>
                    </Typography>
                    <Typography sx={{ fontSize: '1.3rem', color: 'primary.main', opacity: 0.8, fontWeight: 500 }}>
                        Our comprehensive API seamlessly integrates with the Eduman MIS,
                        enabling third-party vendors to connect directly to our platform
                        and consolidate all dispersed systems into a single source of truth.
                    </Typography>
                </Container>
            </Box>

            {/* Product List */}
            {products.map((product, index) => (
                <ProductRow key={index} {...product} />
            ))}
        </Box>
    );
};

export default ProductsSection;
