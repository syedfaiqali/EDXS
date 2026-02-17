import React, { useRef, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Button,
    keyframes,
    alpha,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse
} from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PaymentsIcon from '@mui/icons-material/Payments';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import HubIcon from '@mui/icons-material/Hub';
import ApiIcon from '@mui/icons-material/Api';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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
    fullDescription?: string | { subtitle: string; points: string[] }[];
    icon: React.ReactNode;
    reverse?: boolean;
    bgColor: string;
    accentColor: string;
    tagline: string;
}

const ProductRow: React.FC<ProductRowProps> = ({ title, description, fullDescription, icon, reverse, bgColor, accentColor, tagline }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(rowRef, { threshold: 0.1 });
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => setIsExpanded(!isExpanded);

    return (
        <Box
            ref={rowRef}
            sx={{
                bgcolor: bgColor,
                py: { xs: 12, md: 15 },
                transition: 'all 0.5s ease-in-out',
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
                <Grid container spacing={10} alignItems="flex-start" flexDirection={reverse ? 'row-reverse' : 'row'}>
                    {/* Image/Logo Side */}
                    <Grid size={{ xs: 12, md: 6 }} sx={{ position: 'sticky', top: 120 }}>
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'scale(1)' : 'scale(0.8)',
                                transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                pt: { md: 5 }
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
                                    {React.isValidElement(icon)
                                        ? React.cloneElement(icon as React.ReactElement<any>, { sx: { fontSize: { xs: '5rem', md: '7rem' } } })
                                        : null}
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
                    <Grid size={{ xs: 12, md: 6 }}>
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
                                    mb: 4,
                                    maxWidth: 600,
                                    mx: { xs: 'auto', md: 0 }
                                }}
                            >
                                {description}
                            </Typography>

                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Box sx={{ mb: 4 }}>
                                    {Array.isArray(fullDescription) ? (
                                        <Grid container spacing={3}>
                                            {fullDescription.map((section, idx) => (
                                                <Grid item xs={12} key={idx}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 800,
                                                            color: '#1e293b',
                                                            mb: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1.5,
                                                            fontSize: '1.1rem'
                                                        }}
                                                    >
                                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: accentColor }} />
                                                        {section.subtitle}
                                                    </Typography>
                                                    <List sx={{ pl: 1, py: 0 }}>
                                                        {section.points.map((point, pIdx) => (
                                                            <ListItem key={pIdx} disableGutters sx={{ alignItems: 'flex-start', py: 0.25 }}>
                                                                <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                                                                    <CheckCircleOutlineIcon sx={{ fontSize: '1.1rem', color: accentColor }} />
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary={point}
                                                                    primaryTypographyProps={{ sx: { fontSize: '1rem', color: 'text.secondary', lineHeight: 1.5 } }}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Typography sx={{ fontSize: '1.1rem', color: 'text.secondary', lineHeight: 1.8 }}>
                                            {fullDescription}
                                        </Typography>
                                    )}
                                </Box>
                            </Collapse>

                            <Button
                                variant="text"
                                onClick={toggleExpansion}
                                endIcon={isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                sx={{
                                    color: accentColor,
                                    p: 0,
                                    minWidth: 0,
                                    fontSize: '1.1rem',
                                    fontWeight: 900,
                                    textTransform: 'none',
                                    position: 'relative',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    overflow: 'visible',
                                    '& .MuiButton-endIcon': {
                                        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        ml: 1
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -2,
                                        left: 0,
                                        width: '0%',
                                        height: '3px',
                                        bgcolor: accentColor,
                                        borderRadius: '4px',
                                        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    },
                                    '&:hover': {
                                        bgcolor: 'transparent',
                                        color: accentColor,
                                        '&::after': {
                                            width: '100%'
                                        },
                                        '& .MuiButton-endIcon': {
                                            transform: isExpanded ? 'translateY(-4px)' : 'translateY(4px)'
                                        }
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {isExpanded ? 'Read Less' : 'Read More'}
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
            description: 'EduMart is a comprehensive marketplace targeted to the students of schools, colleges, and universities. All the products and vendors on EduMart will be carefully selected to cater all the needs of targeted audience.',
            fullDescription: [
                {
                    subtitle: 'Ecosystem & Reach',
                    points: [
                        'Introduced as an icon in the existing parent app of EduMan.',
                        'Established LMS used by 60,000+ parents all over Pakistan.',
                        'Will be launched as a separate app accessible to everyone.'
                    ]
                },
                {
                    subtitle: 'Comprehensive Shopping Solution',
                    points: [
                        'Wide range of products for children aged 4 to 19.',
                        'Includes school supplies, stationery, textbooks, educational toys, and essentials.'
                    ]
                },
                {
                    subtitle: 'Academic Support',
                    points: [
                        'Course Guidelines and Availability: Access comprehensive guidelines and availability on a single platform.',
                        'Helps students and parents plan their academic journey effectively.'
                    ]
                },
                {
                    subtitle: 'Sustainability & Savings',
                    points: [
                        'Used Books Availability: Marketplace for buying and selling used books to save money and reduce waste.',
                        'Free Books Availability: selection of free books promoting access to education and literacy across socio-economic backgrounds.'
                    ]
                },
                {
                    subtitle: 'Digital Resources',
                    points: [
                        'Online Library: Borrow digital books, research materials, and educational resources.',
                        'Enhances learning opportunities and encourages healthy reading habits.'
                    ]
                },
                {
                    subtitle: 'Additional Value',
                    points: [
                        'Food Vouchers: Special offers at selected restaurants or eateries for families.',
                        'Promotes healthy eating habits and offers exclusive discounts.'
                    ]
                }
            ],
            icon: <ShoppingBagIcon />,
            accentColor: '#76a345',
            bgColor: '#ffffff'
        },
        {
            title: 'EduPay',
            tagline: 'Smart Payments',
            description: 'Revolutionize your school\'s financial management. Secure, frictionless payments for fees, uniforms, and activities.',
            fullDescription: [
                {
                    subtitle: 'Seamless Financial Integration',
                    points: [
                        'Facilitates payments within the Eduman platform for fees and tuition.',
                        'Streamlines administrative processes for educational institutions.',
                        'Provides convenience for students and parents when making payments.'
                    ]
                },
                {
                    subtitle: 'Key Features',
                    points: [
                        'Online Payment Processing: Convenient internet-based payments.',
                        'Integration with Eduman: Synchronizes with SIS, attendance, and gradebooks.',
                        'Automated Invoicing: Reduces manual effort by auto-generating accurate invoices.'
                    ]
                },
                {
                    subtitle: 'Key Benefits',
                    points: [
                        'Improved Efficiency: Reduces manual workload for administrative staff.',
                        'Increased Revenue Collection: Efficient collection leads to better cash flow.',
                        'Enhanced Student Experience: Flexible options lead to higher satisfaction and loyalty.'
                    ]
                }
            ],
            icon: <PaymentsIcon />,
            reverse: true,
            accentColor: '#c4a77d',
            bgColor: '#fcf8f1'
        },
        {
            title: 'Eduman Lite',
            tagline: 'Essential Management',
            description: 'Big power, small footprint. Eduman Lite gives burgeoning institutions the elite management tools they deserve.',
            fullDescription: [
                {
                    subtitle: 'Practical & Budget-Friendly',
                    points: [
                        'Practical solution for managing essential administrative tasks.',
                        'Enables schools to operate efficiently while keeping costs under control.',
                        'Ideal for smaller institutions or those on a limited budget.'
                    ]
                },
                {
                    subtitle: 'Key Features',
                    points: [
                        'Essential Modules: Student info management, attendance tracking, and basic gradebooks.',
                        'Simplified Interface: User-friendly design requiring minimal training.',
                        'Cost-Effective: A powerful alternative to the full comprehensive platform.'
                    ]
                },
                {
                    subtitle: 'Key Benefits',
                    points: [
                        'Cost Savings: Significantly reduces platform expenses for smaller budgets.',
                        'Ease of Implementation: Quick deployment without operational disruptions.',
                        'Scalability: Seamlessly transition to the full Eduman platform as you grow.'
                    ]
                }
            ],
            icon: <FlashOnIcon />,
            accentColor: '#5a7d34',
            bgColor: '#ffffff'
        },
        {
            title: 'Incendio Hub',
            tagline: 'Digital Pulse',
            description: 'The social heart of your digital campus. Engage students, parents, and teachers in a secure, vibrant community.',
            fullDescription: [
                {
                    subtitle: 'Digital Empowerment',
                    points: [
                        'Comprehensive suite of digital services to enhance online presence.',
                        'Empowers schools to thrive in the digital age through engagement.',
                        'Efficiently achieve digital goals via tailored strategies.'
                    ]
                },
                {
                    subtitle: 'Core Services',
                    points: [
                        'Website Development: Professional sites tailored to unique institutional needs.',
                        'Social Media Marketing: Expert campaigns on Facebook, Instagram, Twitter, and LinkedIn.',
                        'Creative Designing: Captivating visuals, logos, branding, and multimedia content.'
                    ]
                },
                {
                    subtitle: 'Strategic Support',
                    points: [
                        'Expert Guidance: Valuable insights from years of education sector experience.',
                        'Maximizes online visibility through SEO optimization and content strategy.',
                        'One-stop solution for all digital and creative requirements.'
                    ]
                },
                {
                    subtitle: 'Key Benefits',
                    points: [
                        'Comprehensive Solution: All digital needs managed under one roof.',
                        'Enhanced Visibility: Stand out in a crowded online space.',
                        'Efficiency: Save valuable time and resources by outsourcing to experts.'
                    ]
                }
            ],
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
