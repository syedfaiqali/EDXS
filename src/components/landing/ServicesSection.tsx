import React, { useRef } from 'react';
import { Box, Typography, Container, Grid, keyframes, alpha } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import GroupsIcon from '@mui/icons-material/Groups';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import BarChartIcon from '@mui/icons-material/BarChart';
import MemoryIcon from '@mui/icons-material/Memory';
import PanToolIcon from '@mui/icons-material/PanTool';
import VrpanoIcon from '@mui/icons-material/Vrpano';

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

interface ServiceRowProps {
    title: string;
    description: string;
    illustration: React.ReactNode;
    reverse?: boolean;
    dark?: boolean;
    delay?: number;
}

const ServiceRow: React.FC<ServiceRowProps> = ({ title, description, illustration, reverse, dark, delay = 0 }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(rowRef, { threshold: 0.2 });

    return (
        <Box
            ref={rowRef}
            sx={{
                bgcolor: dark ? 'primary.main' : 'secondary.main',
                py: { xs: 10, md: 15 },
                color: dark ? 'secondary.main' : 'primary.main',
                overflow: 'hidden'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={8} alignItems="center" flexDirection={reverse ? 'row-reverse' : 'row'}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box sx={{
                            opacity: isVisible ? 1 : 0,
                            animation: isVisible ? `${fadeInUp} 0.8s ease-out forwards` : 'none',
                            animationDelay: `${delay}s`
                        }}>
                            <Typography variant="h3" sx={{
                                fontWeight: 900,
                                mb: 4,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                                textTransform: 'uppercase'
                            }}>
                                {title}
                            </Typography>
                            <Typography sx={{
                                fontSize: '1.25rem',
                                lineHeight: 1.8,
                                opacity: 0.9,
                                fontWeight: 500,
                                color: dark ? 'white' : 'text.primary'
                            }}>
                                {description}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: isVisible ? 1 : 0,
                            animation: isVisible ? `${slideIn} 1s ease-out forwards` : 'none',
                            animationDelay: `${delay + 0.2}s`
                        }}>
                            {illustration}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

const ServicesSection: React.FC = () => {
    return (
        <Box id="services-section">
            {/* Section 1: Bold Decisions */}
            <ServiceRow
                title="MAKE BOLD DECISIONS THAT UNLOCK NEW FRONTIERS OF GROWTH"
                description="We're experts at combining customer needs, business demands, and technical possibilities to disrupt the status quo. Our team of strategists use a Design Sprint-centric methodology to identify opportunities, ignite innovation, and discover new digital ventures to drive growth outside your core business."
                illustration={
                    <Box sx={{ position: 'relative', width: '100%', height: 350, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Box sx={{ position: 'relative' }}>
                            {['HASSEL-FREE', 'TIME-SAVING', 'STREAMLINED', 'OPTIMAL', 'EDXS', 'USER-FRIENDLY'].reverse().map((text, i) => (
                                <Box
                                    key={text}
                                    sx={{
                                        width: 200,
                                        height: text === 'EDXS' ? 50 : 40,
                                        bgcolor: text === 'EDXS' ? 'primary.main' : 'white',
                                        color: text === 'EDXS' ? 'white' : 'primary.main',
                                        border: `1px solid ${text === 'EDXS' ? 'transparent' : '#76a345'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 900,
                                        fontSize: '1rem',
                                        mb: 0.5,
                                        transform: `rotate(${i % 2 === 0 ? '-1deg' : '1deg'})`,
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        zIndex: 10 - i
                                    }}
                                >
                                    {text}
                                </Box>
                            ))}
                            <PanToolIcon sx={{
                                position: 'absolute',
                                left: -80,
                                bottom: 40,
                                fontSize: '8rem',
                                color: '#fdd9b5', // Flesh tone
                                transform: 'rotate(90deg)',
                                filter: 'drop-shadow(4px 8px 12px rgba(0,0,0,0.15))'
                            }} />
                        </Box>
                    </Box>
                }
            />

            {/* Section 2: Reimagined Experiences */}
            <ServiceRow
                dark
                reverse
                title="REIMAGINED EXPERIENCES THAT WIN THE HEARTS OF YOUR CUSTOMERS"
                description="The best designs not only instill confidence in your brand, but inspire users to download, engage, and evangelize. We use human-centered design and research methods to understand your customers and create uniquely memorable product experiences that they'll love."
                illustration={
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, alignItems: 'center' }}>
                            {[1, 2, 3].map((_, i) => (
                                <React.Fragment key={i}>
                                    <GroupsIcon sx={{ fontSize: '6rem', color: 'secondary.main' }} />
                                    {i < 2 && <Typography sx={{ color: 'secondary.main', fontSize: '2.5rem', fontWeight: 900 }}>»</Typography>}
                                </React.Fragment>
                            ))}
                        </Box>
                        <Box sx={{ mt: 2, border: '4px solid', borderColor: 'secondary.main', p: 3, display: 'inline-block' }}>
                            <Typography variant="h1" sx={{ fontWeight: 900, color: 'secondary.main', mb: 0, letterSpacing: 10, fontSize: '4rem' }}>EDXS</Typography>
                            <Typography sx={{ color: 'secondary.main', fontSize: '1rem', letterSpacing: 4, mt: 1, fontWeight: 900 }}>SCHOOL MANAGEMENT SYSTEM</Typography>
                        </Box>
                    </Box>
                }
            />

            {/* Section 3: Build Better Products */}
            <ServiceRow
                title="BUILD BETTER PRODUCTS"
                description="Our full-stack engineering team creates world class products built with a range of technologies, platforms, and frameworks. From mobile apps to websites, frontend to middleware to backend, architecture consulting to cybersecurity strategy — we've got it covered."
                illustration={
                    <Box sx={{ position: 'relative', width: '100%', maxWidth: 450 }}>
                        <LaptopMacIcon sx={{ fontSize: '18rem', color: '#1e293b' }} />
                        <Box sx={{ position: 'absolute', top: '15%', right: '5%', bgcolor: 'primary.main', borderRadius: '50%', p: 2, color: 'white', animation: `${pulse} 2s infinite`, boxShadow: '0 0 20px rgba(118,163,69,0.4)' }}>
                            <MemoryIcon sx={{ fontSize: '2.5rem' }} />
                        </Box>
                        <Box sx={{ position: 'absolute', top: '5%', left: '10%', bgcolor: 'primary.dark', borderRadius: '50%', p: 2, color: 'white', animation: `${pulse} 2.5s infinite`, boxShadow: '0 0 20px rgba(0,0,0,0.2)' }}>
                            <BarChartIcon sx={{ fontSize: '2.5rem' }} />
                        </Box>
                    </Box>
                }
            />

            {/* Section 4: Supercharge Growth */}
            <ServiceRow
                dark
                reverse
                title="SUPERCHARGE SUSTAINABLE GROWTH"
                description="We harness the power of analytics, growth marketing, and experimentation to help you grow your products and your customer base. Our close partnerships with a range of vendors enable us to craft bespoke tool stacks specially optimized to generate revenue and customer loyalty."
                illustration={
                    <Box sx={{ width: '100%', position: 'relative', pt: 5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 280, gap: 3, px: 2 }}>
                            {[
                                { h: 60, label: 'Traditional' },
                                { h: 90, label: 'Manual' },
                                { h: 140, label: 'Slower' },
                                { h: 220, label: 'EDXS', highlighted: true }
                            ].map((item, i) => (
                                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 1 }}>
                                    <Box sx={{
                                        width: '100%',
                                        height: item.h,
                                        bgcolor: item.highlighted ? 'secondary.main' : alpha('#fff', 0.2),
                                        borderRadius: '8px 8px 0 0',
                                        boxShadow: item.highlighted ? '0 0 30px rgba(240,219,176,0.3)' : 'none'
                                    }} />
                                    <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 900, fontSize: '0.7rem' }}>
                                        {item.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                        <Typography variant="h6" sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', color: 'secondary.main', fontWeight: 900 }}>GROWTH CURVE</Typography>
                    </Box>
                }
            />

            {/* Section 5: AI Power */}
            <ServiceRow
                title="LEVEL UP WITH THE POWER OF AI"
                description="We leverage cutting-edge generative AI to build better products, faster. From personalization, to predictive analytics, to smart search, we use AI to power innovative customer experiences and product features. Learn more at edxs.io."
                illustration={
                    <Box sx={{ position: 'relative', animation: `${pulse} 3s infinite ease-in-out` }}>
                        <MemoryIcon sx={{ fontSize: '15rem', color: 'primary.main', filter: 'drop-shadow(0 20px 40px rgba(118,163,69,0.2))' }} />
                        <Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 900, color: 'white', bgcolor: 'primary.main', px: 2, borderRadius: 1 }}>AI</Typography>
                    </Box>
                }
            />

            {/* Section 6: Next-Gen Tech */}
            <ServiceRow
                dark
                reverse
                title="WE LOVE EXPERIMENTING WITH NEXT-GENERATION TECH"
                description="From AR/VR, to IoT, to blockchain, to connected hardware, we're passionate about finding creative ways to apply emerging technologies to real-world business challenges. We're obsessed with exploring the latest and greatest, and when something moves from toy to transformative, our team has a head start."
                illustration={
                    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ position: 'relative' }}>
                            <VrpanoIcon sx={{ fontSize: '12rem', color: 'secondary.main', filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.2))' }} />
                            {/* Decorative dots/tech lines */}
                            <Box sx={{
                                position: 'absolute',
                                top: -20,
                                left: -20,
                                width: 40,
                                height: 40,
                                borderTop: '4px solid',
                                borderLeft: '4px solid',
                                borderColor: 'secondary.main',
                                opacity: 0.6
                            }} />
                            <Box sx={{
                                position: 'absolute',
                                bottom: -20,
                                right: -20,
                                width: 40,
                                height: 40,
                                borderBottom: '4px solid',
                                borderRight: '4px solid',
                                borderColor: 'secondary.main',
                                opacity: 0.6
                            }} />
                        </Box>
                    </Box>
                }
            />
        </Box>
    );
};

export default ServicesSection;
