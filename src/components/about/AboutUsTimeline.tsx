import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

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
            title: 'EDXS enters the commercial market.',
            content: 'We launched the initial web-based Learning Management System with curriculum, timetable, assessments, reporting, and admissions modules.',
            detail: 'Smart School and Al Hamdian, our inaugural partner schools, helped shape the platform through practical feedback.',
            accent: '#1a4163',
            panel: 'linear-gradient(145deg, #f8fbff 0%, #e5eef7 100%)',
            tag: 'Foundation',
        },
        {
            year: 2020,
            title: 'Cloud Hosting Launched',
            content: 'Schools began migrating from legacy systems as EDXS introduced managed cloud hosting for faster onboarding and simpler operations.',
            detail: 'Institutions could choose cloud deployment or self-hosting, based on their internal IT capacity.',
            accent: '#c29a5c',
            panel: 'linear-gradient(145deg, #f8f1df 0%, #f0dbb0 100%)',
            tag: 'Infrastructure',
        },
        {
            year: 2021,
            title: 'Parents, Teachers, and School Connected',
            content: 'We expanded communication by introducing role-focused applications for school admins, teachers, and parents.',
            detail: 'The release improved staff coordination and enabled direct, timely communication with families.',
            accent: '#76a345',
            panel: 'linear-gradient(145deg, #eff6e3 0%, #dceabf 100%)',
            tag: 'Engagement',
        },
        {
            year: 2022,
            title: 'EDXS Goes Global',
            content: 'International expansion began with deployments in Bahrain and Oman, establishing EDXS in new academic markets.',
            detail: 'Mobile support was also strengthened to provide easier platform access for school communities.',
            accent: '#1a4163',
            panel: 'linear-gradient(145deg, #f8fbff 0%, #e5eef7 100%)',
            tag: 'Global Reach',
        },
        {
            year: 2023,
            title: 'Good Conduct Attracts More Schools',
            content: 'Rapid adoption continued as more institutions joined and new modules were introduced for Library and Asset Management.',
            detail: 'Schools reported better organization and improved operational efficiency through centralized workflows.',
            accent: '#c29a5c',
            panel: 'linear-gradient(145deg, #f8f1df 0%, #f0dbb0 100%)',
            tag: 'Scale Up',
        },
        {
            year: 2024,
            title: 'EDXS launches EDXS Lite',
            content: 'A streamlined edition was introduced for schools needing essential, cost-effective features with quick implementation.',
            detail: 'EDXS Lite delivered practical modules for institutions looking for strong outcomes with leaner deployment.',
            accent: '#76a345',
            panel: 'linear-gradient(145deg, #1a4163 0%, #123451 100%)',
            tag: 'Product Expansion',
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const activeData = timelineData[activeIndex];
    const progressPercent = (activeIndex / (timelineData.length - 1)) * 100;
    const isDarkPanel = activeData.year === 2024;

    const goPrev = () => setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    const goNext = () => setActiveIndex((prev) => (prev < timelineData.length - 1 ? prev + 1 : prev));

    return (
        <Box
            ref={sectionRef}
            mb={12}
            sx={{
                position: 'relative',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s',
                '@keyframes contentShift': {
                    '0%': { opacity: 0, transform: 'translate3d(0, 12px, 0)' },
                    '100%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                },
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    borderRadius: 4,
                    p: { xs: 2, md: 3 },
                    background: 'linear-gradient(180deg, #f8fbff 0%, #f8f1df 100%)',
                    border: '1px solid rgba(26, 65, 99, 0.16)',
                    boxShadow: '0 16px 36px rgba(26, 65, 99, 0.1)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: { xs: 4, md: 6 }, position: 'relative' }}>
                    <Box
                        onClick={goPrev}
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            border: '2px solid rgba(26, 65, 99, 0.22)',
                            color: '#7e90a3',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: { xs: 1, md: 2 },
                            cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                            opacity: activeIndex === 0 ? 0.5 : 1,
                            transition: 'all 0.2s ease',
                            '&:hover': { borderColor: '#1a4163', color: '#1a4163' },
                        }}
                    >
                        {'<'}
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            left: { xs: 56, md: 72 },
                            right: { xs: 56, md: 72 },
                            top: '61%',
                            height: 3,
                            bgcolor: 'rgba(26, 65, 99, 0.2)',
                            borderRadius: 4,
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            left: { xs: 56, md: 72 },
                            top: '61%',
                            width: { xs: `calc((100% - 112px) * ${progressPercent / 100})`, md: `calc((100% - 144px) * ${progressPercent / 100})` },
                            height: 3,
                            bgcolor: '#1a4163',
                            borderRadius: 4,
                            transition: 'width 0.35s ease',
                        }}
                    />

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${timelineData.length}, minmax(44px, 1fr))`,
                            width: '100%',
                            maxWidth: 860,
                            gap: { xs: 1, md: 2 },
                            zIndex: 1,
                        }}
                    >
                        {timelineData.map((data, i) => (
                            <Box
                                key={data.year}
                                onClick={() => setActiveIndex(i)}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: data.accent,
                                        fontWeight: 700,
                                        mb: 1.1,
                                        fontSize: { xs: '0.95rem', md: '1.15rem' },
                                    }}
                                >
                                    {data.year}
                                </Typography>
                                <Box
                                    sx={{
                                        width: activeIndex === i ? 16 : 14,
                                        height: activeIndex === i ? 16 : 14,
                                        borderRadius: '50%',
                                        bgcolor: activeIndex === i ? '#1a4163' : '#f0f5fa',
                                        border: '2px solid #1a4163',
                                        transition: 'all 0.25s ease',
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>

                    <Box
                        onClick={goNext}
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            border: '2px solid rgba(26, 65, 99, 0.22)',
                            color: '#7e90a3',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            ml: { xs: 1, md: 2 },
                            cursor: activeIndex === timelineData.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: activeIndex === timelineData.length - 1 ? 0.5 : 1,
                            transition: 'all 0.2s ease',
                            '&:hover': { borderColor: '#1a4163', color: '#1a4163' },
                        }}
                    >
                        {'>'}
                    </Box>
                </Box>

                <Box
                    key={activeData.year}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1.3fr' },
                        gap: { xs: 3, md: 5 },
                        alignItems: 'center',
                        animation: 'contentShift 0.45s ease',
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <Box
                            sx={{
                                position: 'relative',
                                minHeight: { xs: 220, md: 390 },
                                borderRadius: 3,
                                p: { xs: 2.2, md: 3 },
                                background: activeData.panel,
                                border: '1px solid rgba(26, 65, 99, 0.2)',
                                boxShadow: '0 14px 30px rgba(26, 65, 99, 0.14)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignSelf: 'flex-start',
                                    px: 1.4,
                                    py: 0.5,
                                    borderRadius: 30,
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: isDarkPanel ? '#f5fbff' : '#1a4163',
                                    bgcolor: isDarkPanel ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.64)',
                                }}
                            >
                                {activeData.tag}
                            </Box>

                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    fontSize: { xs: '2rem', md: '2.6rem' },
                                    color: isDarkPanel ? '#f4fbeb' : '#1a4163',
                                    lineHeight: 1.05,
                                }}
                            >
                                {activeData.year}
                            </Typography>

                            <Box sx={{ display: 'grid', gap: 1 }}>
                                <Box sx={{ height: 10, borderRadius: 2, bgcolor: isDarkPanel ? 'rgba(255,255,255,0.25)' : 'rgba(14,45,74,0.14)' }} />
                                <Box sx={{ height: 10, borderRadius: 2, width: '88%', bgcolor: isDarkPanel ? 'rgba(255,255,255,0.2)' : 'rgba(14,45,74,0.12)' }} />
                                <Box sx={{ height: 10, borderRadius: 2, width: '76%', bgcolor: isDarkPanel ? 'rgba(255,255,255,0.16)' : 'rgba(14,45,74,0.1)' }} />
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            borderRadius: 3,
                            p: { xs: 2.2, md: 3.2 },
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            border: '1px solid rgba(26, 65, 99, 0.14)',
                            boxShadow: '0 12px 26px rgba(26, 65, 99, 0.1)',
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                color: '#1a4163',
                                fontWeight: 700,
                                mb: 2.4,
                                lineHeight: 1.2,
                                fontSize: { xs: '1.8rem', md: '2.45rem' },
                            }}
                        >
                            {activeData.title}
                        </Typography>
                        <Typography
                            sx={{
                                color: '#4c6176',
                                lineHeight: 1.65,
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                mb: 2,
                            }}
                        >
                            {activeData.content}
                        </Typography>
                        <Typography
                            sx={{
                                color: '#4c6176',
                                lineHeight: 1.65,
                                fontSize: { xs: '1rem', md: '1.1rem' },
                            }}
                        >
                            {activeData.detail}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AboutUsTimeline;
