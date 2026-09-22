import React, { useRef, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, keyframes } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { useDispatch } from 'react-redux';
import { setGlobalStep } from '../../store/selectionSlice';
import { useNavigate } from 'react-router-dom';
import { TRIAL_DAYS } from '../../api/trial';
import dashboardImage from '../../assets/01_Dashboard.webp';
import humanResourceImage from '../../assets/02_Human_Resource_HR.webp';
import organizationImage from '../../assets/03_Organization.webp';
import administrationImage from '../../assets/04_Administration.webp';
import studentImage from '../../assets/05_Student.webp';
import academicsImage from '../../assets/06_Academics.webp';
import frontOfficeImage from '../../assets/07_Front_Office.webp';
import libraryImage from '../../assets/08_Library.webp';
import communicationImage from '../../assets/09_Communication.webp';
import feeManagementImage from '../../assets/10_Fee_Management.webp';
import financialManagementImage from '../../assets/11_Financial_Management.webp';
import freightManagementImage from '../../assets/12_Freight_Management.webp';
import inventoryManagementImage from '../../assets/13_Inventory_Management.webp';
import transportManagementImage from '../../assets/14_Transport_Management.webp';
import lmsAiImage from '../../assets/15_LMS_AI.webp';
import examinationsImage from '../../assets/16_Examinations.webp';

const revealScroll = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scrollLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const TestimonialsSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(sectionRef);
    const dispatch = useDispatch();
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isSliding, setIsSliding] = React.useState(false);
    const navigate = useNavigate();

    const testimonials = [
        { name: 'Dashboard', role: 'EDXS Module', text: 'A complete overview of students, staff, revenue, attendance and daily school activity.', image: dashboardImage },
        { name: 'Human Resource', role: 'EDXS Module', text: 'Manage staff records, attendance, payroll and performance in one place.', image: humanResourceImage },
        { name: 'Organization', role: 'EDXS Module', text: 'Configure campuses, departments and the academic structure.', image: organizationImage },
        { name: 'Administration', role: 'EDXS Module', text: 'Streamline administrative work with a centralized workspace.', image: administrationImage },
        { name: 'Student', role: 'EDXS Module', text: 'Keep student information and activity organized.', image: studentImage },
        { name: 'Academics', role: 'EDXS Module', text: 'Plan classes, subjects and academic operations with ease.', image: academicsImage },
        { name: 'Front Office', role: 'EDXS Module', text: 'Handle visitor, inquiry and front-desk workflows.', image: frontOfficeImage },
        { name: 'Library', role: 'EDXS Module', text: 'Manage books, issue records and library activity.', image: libraryImage },
        { name: 'Communication', role: 'EDXS Module', text: 'Send messages, notices and updates across the school.', image: communicationImage },
        { name: 'Fee Management', role: 'EDXS Module', text: 'Track fees, vouchers, dues and collections.', image: feeManagementImage },
        { name: 'Financial Management', role: 'EDXS Module', text: 'Monitor revenue, expenses and financial reporting.', image: financialManagementImage },
        { name: 'Freight Management', role: 'EDXS Module', text: 'Manage freight-related operations efficiently.', image: freightManagementImage },
        { name: 'Inventory Management', role: 'EDXS Module', text: 'Track stock, items and inventory movement.', image: inventoryManagementImage },
        { name: 'Transport Management', role: 'EDXS Module', text: 'Manage routes, vehicles and transport operations.', image: transportManagementImage },
        { name: 'LMS / AI Learning', role: 'EDXS Module', text: 'Support learning workflows with LMS and AI tools.', image: lmsAiImage },
        { name: 'Examinations', role: 'EDXS Module', text: 'Organize exams, results and assessment workflows.', image: examinationsImage }
    ];

    // Split into two fixed columns
    const col1 = testimonials.filter((_, i) => i % 2 === 0);
    const col2 = testimonials.filter((_, i) => i % 2 !== 0);
    const columns = [col1, col2];

    useEffect(() => {
        const slideDuration = 1000; // ms
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
        <Box ref={sectionRef} sx={{ bgcolor: '#e9efdd', pt: 10, pb: 0, px: '5%', position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Split Background Effect */}
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '80%',
                bgcolor: '#f5f7ef',
                zIndex: 0
            }} />
            <Grid container justifyContent="center" spacing={4} sx={{ position: 'relative', zIndex: 1, mb: 10 }}>
                {columns.map((col, colIndex) => {
                    const columnIndex = activeIndex % col.length;
                    const currentItem = col[columnIndex];
                    const nextItem = col[(columnIndex + 1) % col.length];

                    return (
                        <Grid key={colIndex} size={{ xs: 12, md: 5 }} sx={{
                            opacity: 0,
                            animation: isVisible ? `${revealScroll} 0.8s ease forwards` : 'none',
                            animationDelay: `${colIndex * 0.2}s`,
                            backfaceVisibility: 'hidden',
                            transform: 'translateZ(0)',
                        }}>
                            <Paper elevation={0} sx={{
                                p: { xs: 4, md: 5 },
                                borderRadius: 4,
                                height: { xs: 'auto', md: 270 },
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
            <Box textAlign="center" pt={5} pb={4} sx={{ position: 'relative', zIndex: 1, color: 'white' }}>
                <Typography variant="h3" fontWeight="900" color= '#76a345' sx={{ mb: 2, letterSpacing: -1 }}>
                    Still Not Convinced?
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 500, color: '#76a345' }}>
                    Experience the EDXS difference first-hand
                </Typography>
            </Box>

            {/* Horizontal Marquee Section */}
            <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', zIndex: 2, pb: 2 }}>
                <Box sx={{
                    display: 'flex',
                    width: 'max-content',
                    animation: `${scrollLeft} 100s linear infinite`,
                    '&:hover': { animationPlayState: 'paused' },
                }}>
                    {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                        <Paper key={i} elevation={0} sx={{
                            minWidth: 420,
                            maxWidth: 420,
                            mx: 2,
                            p: t.image ? 0 : 4,
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
                                    opacity: 0.9,
                                    visibility: 'visible'
                                }
                            }
                        }}>
                            {t.image ? (
                                <>
                                    <Box
                                        component="img"
                                        src={t.image}
                                        alt={`${t.name} module preview`}
                                        sx={{ width: '100%', height: 240, display: 'block', objectFit: 'cover', objectPosition: 'center' }}
                                    />
                                    <Box sx={{ px: 3, py: 2.5 }}>
                                        <Typography variant="subtitle2" sx={{ color: '#76a345', fontWeight: 800, fontSize: '1rem' }}>
                                            {t.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#999', fontWeight: 600 }}>
                                            {t.role}
                                        </Typography>
                                    </Box>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}

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
                                    onClick={() => navigate('/products')}
                                    sx={{
                                        bgcolor: '#dce9cb',
                                        color: '#76a345',
                                        px: 5,
                                        py: 1.5,
                                        borderRadius: 3,
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        border: '2px solid #dce9cb',
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
                    onClick={() => { dispatch(setGlobalStep('selection')); navigate('/free-trial'); }}
                    sx={{
                        bgcolor: '#dce9cb',
                        color: '#76a345',
                        px: 4,
                        py: 1.5,
                        border: '2px solid #dce9cb',
                        borderRadius: 50,
                        fontWeight: 700,
                        fontSize: '1rem',
                        '&:hover': {
                            bgcolor: '#c7dcb0',
                            borderColor: '#c7dcb0'
                        },
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                    }}
                >
                    Start {TRIAL_DAYS} Day Free Trial
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => { dispatch(setGlobalStep('selection')); navigate('/contact'); }}
                    sx={{
                        px: 4,
                        py: 1.5,
                        bgcolor: '#dce9cb',
                        color: '#76a345',
                        border: '2px solid #dce9cb',
                        borderRadius: 50,
                        fontWeight: 700,
                        fontSize: '1rem',
                        '&:hover': {
                            bgcolor: '#c7dcb0',
                            border: '2px solid #76a345'
                        },
                        boxShadow: '0 4px 14px rgba(118, 163, 69, 0.2)'
                    }}
                >
                    Book a Sale Call
                </Button>
            </Box>
        </Box >
    );
};

export default TestimonialsSection;
