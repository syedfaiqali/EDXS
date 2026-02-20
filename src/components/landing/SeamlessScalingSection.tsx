import React, { useRef } from 'react';
import { Box, Container, Grid, Typography, keyframes } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import {
    AssessmentOutlined,
    BadgeOutlined,
    SchoolOutlined,
    DesktopWindowsOutlined,
    PowerOutlined,
    Inventory2Outlined
} from '@mui/icons-material';

const reveal = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const features = [
    {
        title: "Financial Management",
        desc: "Streamline your finances with precision and clarity, ensuring every dollar is accounted for and optimized for growth.",
        icon: AssessmentOutlined
    },
    {
        title: "Human Resources",
        desc: "Empower your team with seamless HR processes, from recruitment to performance management, fostering a productive and engaged workforce.",
        icon: BadgeOutlined
    },
    {
        title: "Academics",
        desc: "Elevate educational excellence with comprehensive tools for curriculum management, grading, and academic planning.",
        icon: SchoolOutlined
    },
    {
        title: "Front Office",
        desc: "Efficiently manage administrative tasks and streamline communication with parents, staff, and stakeholders for a smooth operational flow.",
        icon: DesktopWindowsOutlined
    },
    {
        title: "Student Management",
        desc: "Empower student success with tools for enrollment, attendance tracking, and personalized academic support, nurturing each individual's growth.",
        icon: PowerOutlined
    },
    {
        title: "Asset Management",
        desc: "Efficiently track, maintain, and optimize your school's physical assets, ensuring resources are utilized effectively to support learning initiatives.",
        icon: Inventory2Outlined
    }
];

const SeamlessScalingSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(sectionRef);
    const titleText = "Seamless Scaling: Features For Pain-Free Growth";
    const subText = "Centralized Solutions: Your School Management essentials All Together";

    return (
        <Box ref={sectionRef} sx={{ bgcolor: '#edd8b4', py: 15, px: '5%' }}>
            <Container maxWidth="xl">
                <Box textAlign="center" mb={10}>
                    <Typography variant="h3" fontWeight="800" sx={{ color: '#333', mb: 2 }}>
                        {titleText.split('').map((char, i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    opacity: 0,
                                    animation: isVisible ? `${reveal} 0.5s ease forwards` : 'none',
                                    animationDelay: `${i * 0.03}s`
                                }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </Box>
                        ))}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#666', fontWeight: 'normal', opacity: 0.8 }}>
                        {subText.split(' ').map((word, i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    opacity: 0,
                                    animation: isVisible ? `${reveal} 0.5s ease forwards` : 'none',
                                    animationDelay: `${(titleText.length * 0.03) + (i * 0.08)}s`,
                                    mr: '0.25em'
                                }}
                            >
                                {word}
                            </Box>
                        ))}
                    </Typography>
                </Box>

                <Grid container spacing={8}>
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Grid key={index} size={{ xs: 12, md: 4 }} sx={{
                                opacity: 0,
                                animation: isVisible ? `${reveal} 0.6s ease forwards` : 'none',
                                animationDelay: `${(titleText.length * 0.03) + (subText.split(' ').length * 0.08) + (index * 0.15)}s`
                            }}>
                                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                    <Box sx={{
                                        minWidth: 70,
                                        height: 60,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Icon sx={{ fontSize: 50, color: '#333' }} /> {/* Using dark grey for icons as depicted */}
                                        {/* To simulate the yellow 'box' or highlight from the screenshot if needed, we'd add it here.
                                            But for now sticking to clean outline icons. */}
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold" sx={{ color: '#333', mb: 1.5, fontSize: '1.4rem' }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.6 }}>
                                            {feature.desc}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
};

export default SeamlessScalingSection;
