import React, { useRef } from 'react';
import { Box, Typography, Container, Grid, Button, keyframes, alpha } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PaymentsIcon from '@mui/icons-material/Payments';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import HubIcon from '@mui/icons-material/Hub';
import ApiIcon from '@mui/icons-material/Api';

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
`;

interface ProductRowProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    reverse?: boolean;
    bgColor: string;
    accentColor: string;
    tagline: string;
}

const ProductRow: React.FC<ProductRowProps> = ({ title, description, icon, reverse, bgColor, accentColor, tagline }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(rowRef, { threshold: 0.2 });

    return (
        <Box
            ref={rowRef}
            sx={{
                bgcolor: bgColor,
                py: { xs: 12, md: 20 },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    [reverse ? 'right' : 'left']: 0,
                    width: '40%',
                    height: '100%',
                    background: `linear-gradient(${reverse ? 'to left' : 'to right'}, ${alpha(accentColor, 0.05)}, transparent)`,
                    zIndex: 0
                }
            }}
        >
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={10} alignItems="center" flexDirection={reverse ? 'row-reverse' : 'row'}>
                    {/* Image/Logo Side */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'scale(1)' : 'scale(0.8)',
                                transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}
                        >
                            {/* Decorative Outer Rings */}
                            <Box sx={{
                                position: 'absolute',
                                width: { xs: 300, md: 450 },
                                height: { xs: 300, md: 450 },
                                borderRadius: '50%',
                                border: `1px dashed ${alpha(accentColor, 0.3)}`,
                                animation: `${orbit} 15s linear infinite`
                            }} />
                            <Box sx={{
                                position: 'absolute',
                                width: { xs: 250, md: 350 },
                                height: { xs: 250, md: 350 },
                                borderRadius: '50%',
                                border: `2px solid ${alpha(accentColor, 0.1)}`,
                            }} />

                            {/* Main Product Circle */}
                            <Box
                                sx={{
                                    width: { xs: 220, md: 320 },
                                    height: { xs: 220, md: 320 },
                                    borderRadius: '50%',
                                    bgcolor: 'white',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 40px 100px ${alpha(accentColor, 0.2)}`,
                                    border: `8px solid white`,
                                    animation: `${float} 6s ease-in-out infinite`,
                                    zIndex: 2
                                }}
                            >
                                <Box sx={{ color: accentColor, mb: 1 }}>
                                    {React.cloneElement(icon as React.ReactElement, { sx: { fontSize: { xs: '5rem', md: '7rem' } } })}
                                </Box>
                                <Typography sx={{
                                    fontWeight: 900,
                                    fontSize: '1.2rem',
                                    color: accentColor,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase'
                                }}>
                                    {title}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Text Side */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateX(0)' : `translateX(${reverse ? '-50px' : '50px'})`,
                            transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                            textAlign: { xs: 'center', md: 'left' }
                        }}>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: accentColor,
                                    fontWeight: 900,
                                    letterSpacing: '0.3em',
                                    mb: 2,
                                    display: 'block'
                                }}
                            >
                                {tagline}
                            </Typography>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 900,
                                    fontSize: { xs: '2.5rem', md: '4rem' },
                                    color: '#1e293b',
                                    lineHeight: 1.1,
                                    mb: 3,
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                {title}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '1.25rem',
                                    color: 'text.secondary',
                                    lineHeight: 1.7,
                                    mb: 5,
                                    maxWidth: 500,
                                    mx: { xs: 'auto', md: 0 }
                                }}
                            >
                                {description}
                            </Typography>

                            <Button
                                variant="contained"
                                endIcon={<KeyboardArrowRightIcon />}
                                sx={{
                                    bgcolor: accentColor,
                                    color: 'white',
                                    py: 2,
                                    px: 5,
                                    borderRadius: 3,
                                    fontSize: '1.1rem',
                                    boxShadow: `0 15px 30px ${alpha(accentColor, 0.3)}`,
                                    '&:hover': {
                                        bgcolor: alpha(accentColor, 0.8),
                                        transform: 'translateY(-5px)',
                                        boxShadow: `0 20px 40px ${alpha(accentColor, 0.4)}`,
                                    }
                                }}
                            >
                                Explore Features
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

const ProductsSection: React.FC = () => {
    const products = [
        {
            title: 'EduMart',
            tagline: 'Global Marketplace',
            description: 'A comprehensive marketplace bridging the gap between quality education products and the families who need them. Integrated directly into the award-winning Eduman ecosystem.',
            icon: <ShoppingBagIcon />,
            accentColor: '#76a345',
            bgColor: '#ffffff'
        },
        {
            title: 'EduPay',
            tagline: 'Smart Payments',
            description: 'Revolutionize your school\'s financial management. Secure, frictionless payments for fees, uniforms, and activities — all monitored in one beautiful dashboard.',
            icon: <PaymentsIcon />,
            reverse: true,
            accentColor: '#c4a77d',
            bgColor: '#fcf8f1'
        },
        {
            title: 'Eduman Lite',
            tagline: 'Essential Management',
            description: 'Big power, small footprint. Eduman Lite gives burgeoning institutions the elite management tools they deserve, without the overhead. Built for speed, scaled for success.',
            icon: <FlashOnIcon />,
            accentColor: '#5a7d34',
            bgColor: '#ffffff'
        },
        {
            title: 'Incendio Hub',
            tagline: 'Digital Pulse',
            description: 'The social heart of your digital campus. Engage students, parents, and teachers in a secure, vibrant community that reflects your unique school identity.',
            icon: <HubIcon />,
            reverse: true,
            accentColor: '#76a345',
            bgColor: '#f7fbf3'
        }
    ];

    return (
        <Box id="products">
            {/* Main Header */}
            <Box sx={{ py: 15, bgcolor: '#f0dbb0', textAlign: 'center', position: 'relative' }}>
                <Container maxWidth="md">
                    <Box sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: 'white',
                        mb: 3,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }}>
                        <ApiIcon sx={{ fontSize: '3rem', color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h2" sx={{ fontWeight: 900, color: 'primary.main', mb: 3, fontSize: { xs: '3rem', md: '4.5rem' } }}>
                        Integrated Ecosystem
                    </Typography>
                    <Typography sx={{ fontSize: '1.4rem', color: 'primary.main', opacity: 0.8, maxWidth: 700, mx: 'auto', fontWeight: 500 }}>
                        Powerful tools designed to work in perfect harmony,
                        consolidating all your educational systems into a single source of truth.
                    </Typography>
                </Container>
            </Box>

            {/* Alternating Product Sections */}
            {products.map((product, index) => (
                <ProductRow key={index} {...product} />
            ))}
        </Box>
    );
};

export default ProductsSection;
