import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, keyframes, Container, Chip } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const contentIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(20px); filter: blur(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
`;

const AboutUsTimeline: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const observerVisible = useIntersectionObserver(sectionRef, { threshold: 0 });
    const [forceVisible, setForceVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setForceVisible(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const isVisible = observerVisible || forceVisible;

    const timelineData = [
        {
            year: 2019,
            title: 'Foundations of Innovation',
            content: 'The birth of EDXS. We launched a core vision to redefine classroom management and academic reporting.',
            detail: 'Started with just two flagship schools that believed in a digital-first future.',
            accent: '#76a345',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop',
            tag: 'THE GENESIS',
        },
        {
            year: 2020,
            title: 'Cloud-Scale Architecture',
            content: 'Global disruption met global solution. We pivoted to a 100% cloud-native ecosystem.',
            detail: 'Enabled schools to operate remotely without losing a second of academic progress.',
            accent: '#5a7d34',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
            tag: 'SCALABILITY',
        },
        {
            year: 2021,
            title: 'The Unified Ecosystem',
            content: 'Bridging the triangle: Parents, Teachers, and Students finally united in one intelligent interface.',
            detail: 'Real-time notifications and automated grade tracking became the new gold standard.',
            accent: '#76a345',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
            tag: 'ENGAGEMENT',
        },
        {
            year: 2022,
            title: 'International Presence',
            content: 'Expansion into Bahrain and Oman. EDXS becomes a preferred partner for international curricula.',
            detail: 'Multilingual support and regional compliance modules were successfully integrated.',
            accent: '#5a7d34',
            image: 'https://images.unsplash.com/photo-1526285033482-02bcda1fc629?q=80&w=2071&auto=format&fit=crop',
            tag: 'GLOBAL REACH',
        },
        {
            year: 2023,
            title: 'Automated Oversight',
            content: 'Introduction of AI-driven asset management and smart library resource tracking.',
            detail: 'Providing administrators with predictive analytics for school growth planning.',
            accent: '#76a345',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop',
            tag: 'INTELLIGENCE',
        },
        {
            year: 2024,
            title: 'EDXS Lite: Efficiency Unleashed',
            content: 'A powerhouse platform for schools of all sizes. Focused on maximum impact with minimum setup.',
            detail: 'Revolutionizing how entry-level institutions adopt world-class technology.',
            accent: '#ffffff',
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
            tag: 'ACCESSIBILITY',
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const activeData = timelineData[activeIndex];
    const progressPercent = (activeIndex / (timelineData.length - 1)) * 100;

    return (
        <Box
            ref={sectionRef}
            mb={0}
            sx={{
                position: 'relative',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(80px)',
                transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
            }
            }
        >
            <Box
                sx={{
                    position: 'relative',
                    borderRadius: { xs: 8, md: 12 },
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 60px 150px rgba(0,0,0,0.1)',
                    p: { xs: 4, md: 8 },
                    mb: 10
                }}
            >
                {/* Years Navigation */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: { xs: 8, md: 12 }, position: 'relative' }}>
                    <Box
                        onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
                        sx={{
                            width: 60, height: 60, borderRadius: '50%', border: '1px solid rgba(118,163,69,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            zIndex: 10, transition: 'all 0.3s ease', bgcolor: 'white',
                            color: 'primary.main', opacity: activeIndex === 0 ? 0.2 : 1,
                            '&:hover': { bgcolor: 'primary.main', color: 'white' }
                        }}
                    >
                        <ArrowBackIosNewIcon fontSize="small" />
                    </Box>

                    <Box sx={{ flex: 1, position: 'relative', mx: 4, display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ position: 'absolute', width: '100%', height: 4, bgcolor: 'rgba(118, 163, 69, 0.1)', borderRadius: 2 }} />
                        <Box sx={{
                            position: 'absolute', width: `${progressPercent}%`, height: 4,
                            bgcolor: 'primary.main', borderRadius: 2,
                            boxShadow: '0 0 20px rgba(118, 163, 69, 0.5)',
                            transition: 'width 0.8s cubic-bezier(0.65, 0, 0.35, 1)'
                        }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', zIndex: 5 }}>
                            {timelineData.map((data, i) => (
                                <Box
                                    key={data.year}
                                    onClick={() => setActiveIndex(i)}
                                    sx={{
                                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        transform: activeIndex === i ? 'scale(1.2)' : 'scale(1)',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                    }}
                                >
                                    <Typography sx={{
                                        fontWeight: 900, mb: 2, fontSize: { xs: '0.8rem', md: '1.2rem' },
                                        color: activeIndex === i ? 'primary.main' : 'text.disabled',
                                    }}>
                                        {data.year}
                                    </Typography>
                                    <Box sx={{
                                        width: 20, height: 20, borderRadius: '50%',
                                        bgcolor: activeIndex === i ? 'primary.main' : 'white',
                                        border: `3px solid ${activeIndex === i ? '#76a345' : '#e2e8f0'}`,
                                        boxShadow: activeIndex === i ? '0 0 15px rgba(118, 163, 69, 0.4)' : 'none'
                                    }} />
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box
                        onClick={() => setActiveIndex(prev => Math.min(timelineData.length - 1, prev + 1))}
                        sx={{
                            width: 60, height: 60, borderRadius: '50%', border: '1px solid rgba(118,163,69,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            zIndex: 10, transition: 'all 0.3s ease', bgcolor: 'white',
                            color: 'primary.main', opacity: activeIndex === timelineData.length - 1 ? 0.2 : 1,
                            '&:hover': { bgcolor: 'primary.main', color: 'white' }
                        }}
                    >
                        <ArrowForwardIosIcon fontSize="small" />
                    </Box>
                </Box>

                {/* Content Area */}
                <Box
                    key={activeIndex}
                    sx={{
                        display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
                        gap: { xs: 6, md: 10 }, alignItems: 'center',
                        animation: `${contentIn} 0.8s cubic-bezier(0.23, 1, 0.32, 1)`
                    }}
                >
                    <Box sx={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: { xs: 300, md: 500 }, border: '1px solid rgba(255,255,255,0.4)' }}>
                        <Box sx={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundImage: `url(${activeData.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                            transition: 'transform 1.5s ease', transform: 'scale(1.1)', '&:hover': { transform: 'scale(1)' }
                        }} />
                        <Box sx={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8))'
                        }} />
                        <Box sx={{ position: 'absolute', bottom: 40, left: 40, right: 40 }}>
                            <Chip label={activeData.tag} sx={{ bgcolor: 'secondary.main', color: 'primary.main', fontWeight: 900, mb: 2, px: 2 }} />
                            <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, fontSize: { xs: '2rem', md: '3.5rem' }, lineHeight: 1 }}>
                                {activeData.year}
                            </Typography>
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="h2" sx={{
                            fontWeight: 900, mb: 4, fontSize: { xs: '2.5rem', md: '4.5rem' },
                            color: 'text.primary', lineHeight: 1, letterSpacing: '-0.04em'
                        }}>
                            {activeData.title}
                        </Typography>
                        <Typography sx={{
                            color: 'text.secondary', fontSize: { xs: '1.2rem', md: '1.5rem' },
                            mb: 6, lineHeight: 1.6, fontWeight: 500
                        }}>
                            {activeData.content}
                        </Typography>
                        <Box sx={{
                            p: 4, borderRadius: 6, bgcolor: 'rgba(118, 163, 69, 0.08)',
                            borderLeft: '8px solid', borderColor: 'primary.main'
                        }}>
                            <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', fontStyle: 'italic', fontWeight: 600 }}>
                                "{activeData.detail}"
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box >
    );
};

export default AboutUsTimeline;
