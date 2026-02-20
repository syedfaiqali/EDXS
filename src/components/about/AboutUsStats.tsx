import React, { useRef, useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, keyframes } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const countUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(10px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
`;

const AboutUsStats: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const observerVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 });
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        if (observerVisible && !animated) {
            setAnimated(true);
        }
    }, [observerVisible, animated]);

    const stats = [
        { val: '200+', label: 'Global Schools', icon: <SchoolIcon />, color: '#76a345' },
        { val: '7+', label: 'Nations Served', icon: <PublicIcon />, color: '#5a7d34' },
        { val: '1.4M', label: 'Students Impacted', icon: <EmojiEventsIcon />, color: '#94bc65' },
        { val: '80+', label: 'Elite Educators', icon: <PeopleIcon />, color: '#76a345' },
    ];

    return (
        <Box
            ref={sectionRef}
            sx={{
                position: 'relative',
                mb: 16,
                opacity: animated ? 1 : 0,
                transform: animated ? 'translateY(0)' : 'translateY(60px)',
                transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            <Grid container spacing={4}>
                {stats.map((stat, i) => (
                    <Grid size={{ xs: 6, md: 3 }} key={i}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                position: 'relative',
                                textAlign: 'center',
                                borderRadius: 10,
                                bgcolor: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(118, 163, 69, 0.1)',
                                overflow: 'hidden',
                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                animation: animated ? `${countUp} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards ${i * 0.15}s` : 'none',
                                '&:hover': {
                                    transform: 'translateY(-20px)',
                                    bgcolor: 'white',
                                    boxShadow: '0 40px 100px rgba(118, 163, 69, 0.15)',
                                    borderColor: 'primary.main',
                                    '& .stat-icon': {
                                        transform: 'scale(1.2) rotate(10deg)',
                                        color: 'primary.main',
                                        opacity: 0.2
                                    }
                                },
                            }}
                        >
                            <Box
                                className="stat-icon"
                                sx={{
                                    position: 'absolute',
                                    top: -10,
                                    right: -10,
                                    fontSize: '8rem',
                                    color: stat.color,
                                    opacity: 0.05,
                                    transition: 'all 0.6s ease',
                                    pointerEvents: 'none',
                                    zIndex: 0
                                }}
                            >
                                {stat.icon}
                            </Box>

                            <CardContent sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 1 }}>
                                <Box sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(118, 163, 69, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3,
                                    color: 'primary.main',
                                    animation: `${orbit} 4s linear infinite`
                                }}>
                                    {React.cloneElement(stat.icon as any, { sx: { fontSize: '1.8rem' } })}
                                </Box>

                                <Typography
                                    sx={{
                                        fontWeight: 900,
                                        fontSize: { xs: '2.8rem', md: '4rem' },
                                        color: 'primary.main',
                                        lineHeight: 1,
                                        mb: 1.5,
                                        letterSpacing: '-0.04em',
                                        background: `linear-gradient(135deg, ${stat.color} 0%, #1e293b 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {stat.val}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 800,
                                        color: 'text.secondary',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        fontSize: '0.9rem',
                                        opacity: 0.7
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AboutUsStats;
