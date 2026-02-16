import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

// Function to simulate logos with text for now
const MockLogo = ({ text, color }: { text: string; color: string }) => (
    <Box sx={{
        width: '100%',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        border: '1px solid #eee',
        borderRadius: 2,
        color: color,
        fontWeight: 'bold',
        fontSize: '0.8rem',
        textAlign: 'center',
        p: 1
    }}>
        {text}
    </Box>
);

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

    // Timeline Data
    const timelineData = [
        { year: 2019, title: "Ashrei Tech", content: "Partnership initiated with Ashrei Tech to build the foundation of our digital infrastructure." },
        { year: 2020, title: "CAA & FGRF", content: "Expanded operations with CAA and FGRF, launching pilot programs in key regions." },
        { year: 2021, title: "County School", content: "Onboarded County School Systems, refining our curriculum management modules." },
        { year: 2022, title: "Girls College", content: "Dedicated modules for higher education institutions were developed and tested." },
        { year: 2023, title: "S.S System", content: "S.S System joined the EDXS network, bringing our total student count to over 500k." },
        {
            year: 2024,
            title: "EDXS enters the commercial market.",
            content: "We unveiled the initial iteration of EDXS, marking a significant milestone as the first-ever web-based Learning Management System (LMS) available. This version incorporated fundamental features such as curriculum management, timetable coordination, assessments, reporting, and admissions functionality. Smart School and Al Hamdian, our inaugural partner schools, were pivotal in the developmental phase."
        }
    ];

    const [activeYear, setActiveYear] = useState(2024);
    const activeData = timelineData.find(d => d.year === activeYear) || timelineData[timelineData.length - 1];

    return (
        <Box
            ref={sectionRef}
            mb={12}
            sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s'
            }}
        >
            {/* Year Slider */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 8, position: 'relative' }}>
                {/* Navigation Arrows (Visual only for now, can be functional) */}
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, cursor: 'pointer' }}>
                    {'<'}
                </Box>

                {/* Line */}
                <Box sx={{ position: 'absolute', left: '10%', right: '10%', top: '50%', height: 2, bgcolor: '#ddd', zIndex: 0 }} />

                <Box sx={{ display: 'flex', gap: { xs: 2, md: 8 }, zIndex: 1, overflowX: 'auto', py: 2, px: 2, '::-webkit-scrollbar': { display: 'none' } }}>
                    {timelineData.map((data) => (
                        <Box
                            key={data.year}
                            onClick={() => setActiveYear(data.year)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                transform: activeYear === data.year ? 'scale(1.1)' : 'scale(1)'
                            }}
                        >
                            <Typography sx={{
                                color: activeYear === data.year ? '#1a4163' : '#999',
                                fontWeight: 700,
                                mb: 1
                            }}>
                                {data.year}
                            </Typography>
                            <Box sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                bgcolor: activeYear === data.year ? '#1a4163' : '#ddd',
                                border: '3px solid white',
                                boxShadow: '0 0 0 1px #ddd'
                            }} />
                        </Box>
                    ))}
                </Box>

                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 2, cursor: 'pointer' }}>
                    {'>'}
                </Box>
            </Box>

            {/* Content Area */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 8, alignItems: 'center' }}>
                {/* Left Side: Logos Stack/Graphic */}
                <Box sx={{ width: { xs: '100%', md: '40%' } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <MockLogo text="ASHREI TECH" color="#333" />
                        <MockLogo text="CAA / FGRF" color="#1a4163" />
                        <MockLogo text="COUNTY SCHOOL" color="#76a345" />
                        <MockLogo text="S.S SYSTEM" color="#8e44ad" />
                    </Box>
                </Box>

                {/* Right Side: Text */}
                <Box sx={{ width: { xs: '100%', md: '60%' } }}>
                    <Typography variant="h4" sx={{ color: '#1a4163', fontWeight: 700, mb: 3 }}>
                        {activeData.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        {activeData.content}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default AboutUsTimeline;
