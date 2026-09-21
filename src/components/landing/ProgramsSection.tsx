import React, { useRef } from 'react';
import { Box, Typography, Container, Grid, Button, keyframes, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';
import CodeIcon from '@mui/icons-material/Code';
import PaletteIcon from '@mui/icons-material/Palette';
import PublicIcon from '@mui/icons-material/Public';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface Program {
    title: string;
    level: string;
    duration: string;
    description: string;
    icon: React.ReactNode;
}

const programs: Program[] = [
    {
        title: 'Early Years Foundation',
        level: 'Ages 3 – 6',
        duration: '3 Years',
        description: 'A play-led curriculum that builds literacy, numeracy and social confidence through guided discovery, with progress tracked for every child.',
        icon: <SchoolIcon sx={{ fontSize: '3.5rem' }} />
    },
    {
        title: 'STEM & Applied Sciences',
        level: 'Grades 6 – 12',
        duration: '4 – 6 Years',
        description: 'Laboratory-driven physics, chemistry and biology paired with applied mathematics, preparing students for competitive university entry.',
        icon: <ScienceIcon sx={{ fontSize: '3.5rem' }} />
    },
    {
        title: 'Computing & Digital Skills',
        level: 'Grades 8 – 12',
        duration: '3 Years',
        description: 'Programming, data literacy and cybersecurity fundamentals taught on real toolchains, with capstone projects reviewed by industry mentors.',
        icon: <CodeIcon sx={{ fontSize: '3.5rem' }} />
    },
    {
        title: 'Arts & Design',
        level: 'Grades 5 – 12',
        duration: 'Flexible',
        description: 'Studio practice across visual art, music and digital media, culminating in a portfolio ready for creative-arts admissions panels.',
        icon: <PaletteIcon sx={{ fontSize: '3.5rem' }} />
    },
    {
        title: 'Global Languages & Humanities',
        level: 'Grades 4 – 12',
        duration: 'Flexible',
        description: 'Multilingual instruction alongside history, civics and economics, developing the critical writing skills universities look for.',
        icon: <PublicIcon sx={{ fontSize: '3.5rem' }} />
    },
    {
        title: 'Sports & Wellbeing',
        level: 'All Levels',
        duration: 'Year-round',
        description: 'Structured athletics, physical literacy and counselling support, with attendance and health records managed inside EDXS.',
        icon: <SportsSoccerIcon sx={{ fontSize: '3.5rem' }} />
    }
];

const ProgramCard: React.FC<{ program: Program; index: number }> = ({ program, index }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(cardRef, { threshold: 0.15 });

    return (
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Box
                ref={cardRef}
                sx={{
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    p: 5,
                    border: '1px solid',
                    borderColor: alpha('#76a345', 0.15),
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    opacity: isVisible ? 1 : 0,
                    animation: isVisible ? `${fadeInUp} 0.7s ease-out forwards` : 'none',
                    animationDelay: `${index * 0.1}s`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(118,163,69,0.15)'
                    }
                }}
            >
                <Box sx={{ color: 'primary.main' }}>{program.icon}</Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                    {program.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {[program.level, program.duration].map((chip) => (
                        <Typography
                            key={chip}
                            variant="caption"
                            sx={{
                                bgcolor: 'secondary.main',
                                color: 'primary.dark',
                                fontWeight: 800,
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 999
                            }}
                        >
                            {chip}
                        </Typography>
                    ))}
                </Box>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {program.description}
                </Typography>
            </Box>
        </Grid>
    );
};

const ProgramsSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box id="programs-section">
            <Box sx={{ bgcolor: 'primary.main', py: { xs: 10, md: 14 }, color: 'secondary.main' }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase',
                            mb: 3
                        }}
                    >
                        Programs Built Around Every Learner
                    </Typography>
                    <Typography sx={{ fontSize: '1.25rem', lineHeight: 1.8, maxWidth: 800, color: 'white', opacity: 0.9 }}>
                        From early years through graduation, each EDXS program comes with its own curriculum map,
                        assessment schedule and reporting pack — so teachers spend their time teaching, not
                        assembling paperwork.
                    </Typography>
                </Container>
            </Box>

            <Box sx={{ bgcolor: 'background.default', py: { xs: 10, md: 14 } }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {programs.map((program, index) => (
                            <ProgramCard key={program.title} program={program} index={index} />
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ bgcolor: 'secondary.main', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.dark', mb: 2 }}>
                            Not sure which program fits?
                        </Typography>
                        <Typography sx={{ color: 'text.primary', mb: 4, fontSize: '1.1rem' }}>
                            Our admissions team will walk you through the options and the entry requirements.
                        </Typography>
                        <Button
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate('/admission')}
                            sx={{ bgcolor: 'primary.main', color: 'white', px: 4, py: 1.5, fontWeight: 700 }}
                        >
                            Start an Application
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default ProgramsSection;
