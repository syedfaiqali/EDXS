import React from 'react';
import { Box, Typography, Grid, Paper, Button, keyframes } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setGlobalStep } from '../../store/selectionSlice';

const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
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
        <Box sx={{ bgcolor: '#edd8b4', pt: 15, pb: 0, px: '5%', position: 'relative', zIndex: 1 }}>
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

            <Grid container justifyContent="center" sx={{ position: 'relative', zIndex: 1 }}>
                {columns.map((col, colIndex) => {
                    const currentItem = col[activeIndex];
                    const nextItem = col[(activeIndex + 1) % col.length];

                    return (
                        <React.Fragment key={colIndex}>
                            <Grid size={{ xs: 12, md: 5 }}>
                                <Paper elevation={0} sx={{
                                    p: { xs: 4, md: 5 },
                                    borderRadius: 4,
                                    height: 300,
                                    position: 'relative',
                                    pt: 10,
                                    border: 'none',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                                }}>
                                    <Box sx={{
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
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                    }}>"</Box>

                                    {/* Viewport to clip content strictly within padding limits */}
                                    <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                                        {/* Gradient Masks - Reduced height to prevent blurring text */}
                                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 20, background: 'linear-gradient(to bottom, white 0%, transparent 100%)', zIndex: 1 }} />
                                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, background: 'linear-gradient(to top, white 0%, transparent 100%)', zIndex: 1 }} />

                                        {/* Sliding Container */}
                                        <Box sx={{
                                            position: 'relative',
                                            height: '200%', // Holds two items stacked
                                            transform: isSliding ? 'translateY(-50%)' : 'translateY(0)',
                                            transition: isSliding ? 'transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)' : 'none',
                                            mt: -2 // Slight adjustment for spacing
                                        }}>
                                            {[currentItem, nextItem].map((item, i) => (
                                                <Box key={i} sx={{
                                                    height: '50%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    px: 1
                                                }}>
                                                    <Typography variant="h6" align="center" sx={{ mb: 2, lineHeight: 1.6, fontWeight: 500, color: '#444', fontSize: { xs: '0.8rem', md: '0.95rem' } }}>
                                                        {item.text}
                                                    </Typography>
                                                    <Typography variant="subtitle1" align="center" sx={{ color: '#000', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                        {item.name} - {item.role}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                            {colIndex === 0 && <Grid size={{ xs: 12, md: 1 }} sx={{ display: { xs: 'none', md: 'block' } }} />}
                        </React.Fragment>
                    );
                })}
            </Grid>

            <Box textAlign="center" pt={12} pb={2} sx={{ position: 'relative', zIndex: 1, color: 'white' }}>
                <Typography variant="h3" fontWeight="800" sx={{ mb: 2 }}>Still Not Convinced?</Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>See it yourself</Typography>
            </Box>

            {/* Horizontal Marquee Section */}
            <Box sx={{
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 2,
            }}>
                <Box sx={{
                    display: 'flex',
                    width: 'max-content',
                    animation: `${scrollLeft} 40s linear infinite`,
                    '&:hover': { animationPlayState: 'paused' },
                    px: 0
                }}>
                    {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                        <Paper key={i} elevation={3} sx={{
                            minWidth: 400,
                            maxWidth: 400,
                            mx: 3,
                            p: 4,
                            borderRadius: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.95)',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, color: '#444' }}>
                                "{t.text.substring(0, 120)}..."
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: '#76a345', fontWeight: 'bold' }}>
                                {t.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                                {t.role}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Box>
            <Box textAlign="center" pb={12} pt={6} sx={{ position: 'relative', zIndex: 1, color: 'white' }}>
                <Button
                    variant="contained"
                    onClick={() => dispatch(setGlobalStep('selection'))}
                    sx={{
                        bgcolor: '#edd8b4',
                        color: 'white',
                        px: 8,
                        py: 2,
                        borderRadius: '2px #5d8a32',
                        fontWeight: 700,
                        fontSize: '1rem',
                        '&:hover': { borderRadius: '2px solid' },
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                    }}
                >
                    Start 10 Day Free Trial
                </Button>
                <Button
                    variant="contained"
                    onClick={() => dispatch(setGlobalStep('selection'))}
                    sx={{
                        bgcolor: '#76a345',
                        color: 'white',
                        px: 8,
                        py: 2,
                        borderRadius: '2px solid',
                        fontWeight: 700,
                        fontSize: '1rem',
                        '&:hover': { borderRadius: '2px solid' },
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                    }}
                >
                    Book a Sale Call
                </Button>
            </Box>
        </Box>
    );
};

export default TestimonialsSection;
