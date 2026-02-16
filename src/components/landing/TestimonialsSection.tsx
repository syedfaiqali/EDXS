import React from 'react';
import { Box, Typography, Grid, Paper, Button, keyframes } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setGlobalStep } from '../../store/selectionSlice';

const revealScroll = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scrollLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const TestimonialsSection: React.FC = () => {
    const dispatch = useDispatch();
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isSliding, setIsSliding] = React.useState(false);

    const testimonials = [
        { name: 'Ashar Ajaz', role: 'Director Skillston Educational System', text: "EDXS's intuitive interface handles attendance, admissions, and academic reporting with ease. Visually appealing dashboards offer key insights for informed decisions, making it a comprehensive solution for school management." },
        { name: 'Dr Noman Hussain', role: 'Director AKPSS', text: "Since 2020, EDXS has been a game-changer for us. The support team is superb, and the school app is top-notch, replacing the need for other social media tools. Integrated fee payments and centralized campus management make our lives easier." },
        { name: 'Sarah Ahmed', role: 'Principal, Beaconhouse', text: "Switching to EDXS streamlined our entire administrative workflow. The automated grading and attendance tracking have saved hours for our teachers, allowing them to focus more on student engagement and less on paperwork." },
        { name: 'Michael Chen', role: 'Administrator, City School', text: "The financial management module in EDXS is outstanding. We've seen a 40% reduction in fee processing time and improved transparency with parents. The ability to customize reports has been invaluable for our board meetings." }
    ];

    // Split into two fixed columns
    const col1 = testimonials.filter((_, i) => i % 2 === 0);
    const col2 = testimonials.filter((_, i) => i % 2 !== 0);
    const columns = [col1, col2];

    React.useEffect(() => {
        const slideDuration = 800; // ms
        const pauseDuration = 4000; // ms

        const interval = setInterval(() => {
            setIsSliding(true);
            setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % col1.length);
                setIsSliding(false);
            }, slideDuration);
        }, pauseDuration + slideDuration);

        return () => clearInterval(interval);
    }, [col1.length]);

    return (
        <Box sx={{ bgcolor: '#edd8b4', pt: 10, pb: 0, px: '5%', position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Split Background Effect */}
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '75%',
                bgcolor: '#76a345',
                zIndex: 0
            }} />
            <Grid container justifyContent="center" spacing={4} sx={{ position: 'relative', zIndex: 1, mb: 10 }}>
                {columns.map((col, colIndex) => {
                    const currentItem = col[activeIndex];
                    const nextItem = col[(activeIndex + 1) % col.length];

                    return (
                        <Grid item key={colIndex} size={{ xs: 12, md: 5 }} sx={{
                            opacity: 0,
                            animation: `${revealScroll} 0.8s ease forwards`,
                            animationDelay: `${colIndex * 0.2}s`,
                            backfaceVisibility: 'hidden',
                            transform: 'translateZ(0)',
                        }}>
                            <Paper elevation={0} sx={{
                                p: { xs: 4, md: 5 },
                                borderRadius: 4,
                                height: { xs: 'auto', md: 300 },
                                position: 'relative',
                                pt: 8,
                                border: '1px solid rgba(118, 163, 69, 0.1)',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                backfaceVisibility: 'hidden',
                                WebkitFontSmoothing: 'antialiased',
                                transform: 'translateZ(0)',
                                '&:hover': {
                                    transform: 'translateY(-10px) translateZ(0)',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                                    '& .quote-box': {
                                        transform: 'translateX(-50%) rotate(10deg) scale(1.1)',
                                        bgcolor: '#5d8a2e'
                                    }
                                }
                            }}>
                                <Box
                                    className="quote-box"
                                    sx={{
                                        position: 'absolute',
                                        top: -30,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 70,
                                        height: 70,
                                        bgcolor: '#76a345',
                                        borderRadius: 2,
                                        display: 'flex',
                                        zIndex: 2,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '2.5rem',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        transition: 'all 0.4s ease'
                                    }}
                                >
                                    "
                                </Box>

                                <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                                    <Box sx={{
                                        position: 'relative',
                                        height: '200%',
                                        transform: isSliding ? 'translateY(-50%) translateZ(0)' : 'translateY(0) translateZ(0)',
                                        transition: isSliding ? 'transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)' : 'none',
                                        backfaceVisibility: 'hidden',
                                        WebkitFontSmoothing: 'antialiased',
                                    }}>
                                        {[currentItem, nextItem].map((item, i) => (
                                            <Box key={i} sx={{
                                                height: '50%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                                pt: 2,
                                                px: { xs: 1, md: 2 }
                                            }}>
                                                <Typography variant="subtitle1" align="center" sx={{ color: '#76a345', fontWeight: 800, fontSize: '1.25rem', letterSpacing: -0.5, mb: 0.5 }}>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="caption" align="center" sx={{ color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
                                                    {item.role}
                                                </Typography>
                                                <Typography variant="h6" align="center" sx={{ lineHeight: 1.6, fontWeight: 500, color: '#555', fontSize: { xs: '0.85rem', md: '1.05rem' }, fontStyle: 'italic' }}>
                                                    "{item.text}"
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Section Header moved to Top */}
            <Box textAlign="center" pt={5} pb={8} sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" fontWeight="900" sx={{ mb: 2, letterSpacing: -1, color: '#1a4163' }}>
                    Still Not Convinced?
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 500, color: '#76a345' }}>
                    Experience the EDXS difference first-hand
                </Typography>
            </Box>

            {/* Horizontal Marquee Section */}
            <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', zIndex: 2, py: 2 }}>
                <Box sx={{
                    display: 'flex',
                    width: 'max-content',
                    animation: `${scrollLeft} 50s linear infinite`,
                    '&:hover': { animationPlayState: 'paused' },
                }}>
                    {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                        <Paper key={i} elevation={0} sx={{
                            minWidth: 420,
                            maxWidth: 420,
                            mx: 2,
                            p: 4,
                            borderRadius: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                            transition: 'all 0.4s ease',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                                transform: 'scale(1.03)',
                                boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                                borderColor: '#76a345',
                                '& .view-details-overlay': {
                                    opacity: 1,
                                    visibility: 'visible'
                                }
                            }
                        }}>
                            <Typography variant="body1" sx={{ mb: 3, fontWeight: 500, color: '#555', lineHeight: 1.6 }}>
                                "{t.text}"
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="subtitle2" sx={{ color: '#76a345', fontWeight: 800, fontSize: '1rem' }}>
                                    {t.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#999', fontWeight: 600 }}>
                                    {t.role}
                                </Typography>
                            </Box>

                            {/* View Details Overlay */}
                            <Box
                                className="view-details-overlay"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bgcolor: 'rgba(118, 163, 69, 0.95)',
                                    borderRadius: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    visibility: 'hidden',
                                    transition: 'all 0.4s ease',
                                    zIndex: 10
                                }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#edd8b4',
                                        color: '#76a345',
                                        px: 5,
                                        py: 1.5,
                                        borderRadius: 3,
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        border: '2px solid #edd8b4',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: 'white',
                                            borderColor: 'white',
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                                        }
                                    }}
                                >
                                    View Details
                                </Button>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Box>

            <Box textAlign="center" pb={12} pt={6} sx={{ position: 'relative', zIndex: 1, color: 'white', display: 'flex', justifyContent: 'center', gap: 3 }}>
                <Button
                    variant="contained"
                    onClick={() => dispatch(setGlobalStep('selection'))}
                    sx={{
                        bgcolor: '#edd8b4',
                        color: '#76a345',
                        px: 4,
                        py: 1.5,
                        border: '2px solid #edd8b4',
                        borderRadius: 50,
                        fontWeight: 700,
                        fontSize: '1rem',
                        '&:hover': {
                            bgcolor: '#dcc6a0',
                            borderColor: '#dcc6a0'
                        },
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                    }}
                >
                    Start 10 Day Free Trial
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => dispatch(setGlobalStep('selection'))}
                    sx={{
                        bgcolor: 'transparent',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        border: '2px solid white',
                        borderRadius: 50,
                        fontWeight: 700,
                        fontSize: '1rem',
                        '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.1)',
                            border: '2px solid white'
                        },
                        boxShadow: 'none'
                    }}
                >
                    Book a Sale Call
                </Button>
            </Box>
        </Box >
    );
};

export default TestimonialsSection;
