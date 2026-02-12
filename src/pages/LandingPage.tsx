import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, keyframes, Button, TextField, MenuItem, Switch, FormControlLabel, Divider, Fade } from '@mui/material';
import {
    School, Business, AccountBalance, ChevronRight, ArrowBack, ArrowForward, CheckCircleOutline,
    HistoryEdu, Science, Calculate, Brush, Computer, Palette, Biotech, MenuBook,
    Settings, Group, Description
} from '@mui/icons-material';

// --- Keyframes ---
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.2; }
  50% { opacity: 0.5; }
  90% { opacity: 0.2; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
`;

type OrgType = 'school' | 'college' | 'university';
type Step = 'selection' | 'info' | 'organization' | 'complete';

interface SelectedOrg {
    type: OrgType;
    name: string;
    subtitle: string;
    description: string;
    color: string;
}

const LandingPage: React.FC = () => {
    const [step, setStep] = useState<Step>('selection');
    const [logoStage, setLogoStage] = useState<'waiting' | 'opening' | 'finished'>('waiting');
    const [selectedOrg, setSelectedOrg] = useState<SelectedOrg | null>(null);

    useEffect(() => {
        // Logo Split Timeline
        const openTimer = setTimeout(() => setLogoStage('opening'), 1000);
        const finishTimer = setTimeout(() => setLogoStage('finished'), 2500);

        return () => {
            clearTimeout(openTimer);
            clearTimeout(finishTimer);
        };
    }, []);

    const handleSelect = (type: OrgType, name: string, subtitle: string, description: string, color: string) => {
        setSelectedOrg({ type, name, subtitle, description, color });
        setStep('info');
    };

    const handleDone = () => {
        setStep('complete');
        setTimeout(() => {
            // Reset to selection after showing success
            setStep('selection');
            setSelectedOrg(null);
        }, 3000);
    };

    const cards = [
        {
            type: 'school' as const,
            name: 'School',
            subtitle: 'K-12 Education Suite',
            description: 'Comprehensive management for students, exams, and daily attendance.',
            icon: <School sx={{ fontSize: 40 }} />,
            color: '#76a345',
            lightColor: '#eef6e3',
        },
        {
            type: 'college' as const,
            name: 'College',
            subtitle: 'Academic & Vocational',
            description: 'Streamline admissions, faculty workflows, and course scheduling.',
            icon: <Business sx={{ fontSize: 40 }} />,
            color: '#76a345',
            lightColor: '#eef6e3',
        },
        {
            type: 'university' as const,
            name: 'University',
            subtitle: 'Global Campus ERP',
            description: 'Advanced unification for multi-campus research and administration.',
            icon: <AccountBalance sx={{ fontSize: 40 }} />,
            color: '#76a345',
            lightColor: '#eef6e3',
        },
    ];

    // Background Subject Icons
    const subjectIcons = [
        <HistoryEdu key="history" />, <Science key="science" />, <Calculate key="calc" />, <Brush key="brush" />,
        <Computer key="comp" />, <Palette key="palette" />, <Biotech key="bio" />, <MenuBook key="book" />
    ];

    const floatingIcons = Array.from({ length: 15 }).map((_, i) => ({
        icon: subjectIcons[i % subjectIcons.length],
        left: `${Math.random() * 90 + 5}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${15 + Math.random() * 10}s`,
        size: Math.random() * 40 + 30,
        color: Math.random() > 0.5 ? '#76a345' : '#aed581'
    }));

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', bgcolor: '#f1f8e9' }}>

            {/* FLOATING BACKGROUND ICONS - Always visible */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}>
                {floatingIcons.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: 'absolute',
                            bottom: -100,
                            left: item.left,
                            color: item.color,
                            opacity: 0.1,
                            animation: `${float} ${item.animationDuration} linear infinite`,
                            animationDelay: item.animationDelay,
                            fontSize: item.size,
                            '& svg': { fontSize: 'inherit' }
                        }}
                    >
                        {item.icon}
                    </Box>
                ))}
            </Box>

            {/* --- LOGO SPLIT OVERLAY (only on initial load) --- */}
            {step === 'selection' && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 9999,
                        pointerEvents: logoStage === 'finished' ? 'none' : 'auto',
                        display: 'flex',
                    }}
                >
                    {/* Left Panel: "ED" */}
                    <Box
                        sx={{
                            flex: 1,
                            bgcolor: '#76a345',
                            height: '100%',
                            transform: (logoStage === 'opening' || logoStage === 'finished') ? 'translateX(-100%)' : 'translateX(0)',
                            transition: 'transform 1.5s cubic-bezier(0.6, 0.05, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            borderRight: '1px solid rgba(255,255,255,0.2)',
                            pr: 1
                        }}
                    >
                        <Typography variant="h1" sx={{
                            fontSize: '15rem',
                            fontWeight: 900,
                            color: '#fff',
                            letterSpacing: -10,
                            lineHeight: 1
                        }}>
                            ED
                        </Typography>
                    </Box>

                    {/* Right Panel: "XS" */}
                    <Box
                        sx={{
                            flex: 1,
                            bgcolor: '#76a345',
                            height: '100%',
                            transform: (logoStage === 'opening' || logoStage === 'finished') ? 'translateX(100%)' : 'translateX(0)',
                            transition: 'transform 1.5s cubic-bezier(0.6, 0.05, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            borderLeft: '1px solid rgba(255,255,255,0.2)',
                            pl: 1
                        }}
                    >
                        <Typography variant="h1" sx={{
                            fontSize: '15rem',
                            fontWeight: 900,
                            color: '#fff',
                            letterSpacing: -10,
                            lineHeight: 1
                        }}>
                            XS
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* MAIN CONTENT AREA */}
            <Container
                maxWidth="lg"
                sx={{
                    opacity: (logoStage === 'opening' || logoStage === 'finished' || step !== 'selection') ? 1 : 0,
                    transform: (logoStage === 'opening' || logoStage === 'finished' || step !== 'selection') ? 'scale(1)' : 'scale(0.9)',
                    transition: 'all 1s ease 0.5s',
                    position: 'relative',
                    zIndex: 10,
                    pt: 12,
                    pb: 8,
                    minHeight: '100vh'
                }}
            >
                {/* STEP 1: SELECTION */}
                {step === 'selection' && (
                    <Fade in timeout={800}>
                        <Box>
                            <Box mb={6} textAlign="center" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <School sx={{ fontSize: 80, color: '#76a345', mb: 2 }} />
                                <Typography variant="h3" fontWeight="800" sx={{ mb: 1, background: 'linear-gradient(45deg, #76a345, #5a7d34)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                                    Welcome to EDXS
                                </Typography>
                                <Typography variant="h6" color="text.secondary" fontWeight="400">
                                    Please select your organization type to proceed
                                </Typography>
                            </Box>

                            <Grid container spacing={4} justifyContent="center">
                                {cards.map((card) => (
                                    <Grid size={{ xs: 12, md: 4 }} key={card.type}>
                                        <Paper
                                            elevation={0}
                                            onClick={() => handleSelect(card.type, card.name, card.subtitle, card.description, card.color)}
                                            sx={{
                                                p: 4,
                                                height: '100%',
                                                borderRadius: 4,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                bgcolor: 'rgba(255,255,255,0.9)',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                                    borderColor: card.color,
                                                    '& .icon-box': {
                                                        bgcolor: card.color,
                                                        color: '#fff',
                                                        transform: 'scale(1.1)',
                                                    }
                                                }
                                            }}
                                        >
                                            <Box
                                                className="icon-box"
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 4,
                                                    bgcolor: card.lightColor,
                                                    color: card.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 3,
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                {card.icon}
                                            </Box>

                                            <Typography variant="h4" gutterBottom fontWeight="700">
                                                {card.name}
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}>
                                                {card.subtitle}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                                                {card.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                                                <Typography variant="button" sx={{ color: card.color, fontWeight: 700 }}>
                                                    ENTER MODULE
                                                </Typography>
                                                <ChevronRight sx={{ ml: 1, color: card.color }} />
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Fade>
                )}

                {/* STEP 2: INFO PAGE */}
                {step === 'info' && selectedOrg && (
                    <Fade in timeout={800}>
                        <Box>
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={() => setStep('selection')}
                                sx={{ mb: 4 }}
                            >
                                Back to Selection
                            </Button>

                            <Paper sx={{ p: 6, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.95)' }}>
                                <Typography variant="h2" gutterBottom color="primary">
                                    {selectedOrg.name} Information
                                </Typography>
                                <Typography variant="body1" paragraph color="text.secondary">
                                    {selectedOrg.description}
                                </Typography>

                                <Divider sx={{ my: 4 }} />

                                <Typography variant="h3" gutterBottom>
                                    Key Features
                                </Typography>
                                <Box component="ul" sx={{ pl: 4 }}>
                                    <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                                        Streamlined administrative operations tailored for {selectedOrg.name}s.
                                    </Typography>
                                    <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                                        Comprehensive student performance tracking and analytics.
                                    </Typography>
                                    <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                                        Integrated communication hub for parents, students, and staff.
                                    </Typography>
                                    <Typography component="li" variant="body1">
                                        Secure and scalable cloud-based infrastructure.
                                    </Typography>
                                </Box>

                                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForward />}
                                        onClick={() => setStep('organization')}
                                    >
                                        Next
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>
                    </Fade>
                )}

                {/* STEP 3: ORGANIZATION SETUP */}
                {step === 'organization' && selectedOrg && (
                    <Fade in timeout={800}>
                        <Box>
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={() => setStep('info')}
                                sx={{ mb: 4 }}
                            >
                                Back
                            </Button>

                            <Typography variant="h2" gutterBottom align="center" color="primary" sx={{ mb: 6 }}>
                                {selectedOrg.name} Organization Setup
                            </Typography>

                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Paper sx={{ p: 4, height: '100%', borderTop: `4px solid ${selectedOrg.color}`, bgcolor: 'rgba(255,255,255,0.95)' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Settings color="primary" sx={{ mr: 1 }} />
                                            <Typography variant="h5">Core Settings</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <TextField fullWidth label="Institution Name" defaultValue={selectedOrg.name} />
                                            <TextField fullWidth label="Code" placeholder="EB-2024" />
                                            <TextField fullWidth select label="Fiscal Year" defaultValue="2024-25">
                                                <MenuItem value="2023-24">2023-24</MenuItem>
                                                <MenuItem value="2024-25">2024-25</MenuItem>
                                            </TextField>
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Paper sx={{ p: 4, height: '100%', borderTop: `4px solid ${selectedOrg.color}`, bgcolor: 'rgba(255,255,255,0.95)' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Group color="primary" sx={{ mr: 1 }} />
                                            <Typography variant="h5">Visibility</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {['Academics', 'Admission', 'Human Resource', 'Fee Management', 'Dashboard'].map((module) => (
                                                <FormControlLabel
                                                    key={module}
                                                    control={<Switch defaultChecked color="primary" />}
                                                    label={module}
                                                />
                                            ))}
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Paper sx={{ p: 4, height: '100%', borderTop: `4px solid ${selectedOrg.color}`, bgcolor: 'rgba(255,255,255,0.95)' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Description color="primary" sx={{ mr: 1 }} />
                                            <Typography variant="h5">Logo & Branding</Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                border: '2px dashed rgba(0,0,0,0.1)',
                                                borderRadius: 2,
                                                p: 4,
                                                textAlign: 'center',
                                                backgroundColor: 'rgba(0,0,0,0.02)'
                                            }}
                                        >
                                            <Typography variant="body2" color="text.secondary">
                                                Drag and drop your logo here or click to browse
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<CheckCircleOutline />}
                                    sx={{ px: 8, py: 2, fontSize: '1.2rem' }}
                                    onClick={handleDone}
                                >
                                    Done
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                )}

                {/* STEP 4: COMPLETE */}
                {step === 'complete' && (
                    <Fade in timeout={800}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '60vh'
                        }}>
                            <CheckCircleOutline sx={{ fontSize: 120, color: '#76a345', mb: 3 }} />
                            <Typography variant="h2" gutterBottom color="primary" fontWeight="800">
                                Configuration Complete!
                            </Typography>
                            <Typography variant="h5" color="text.secondary">
                                Redirecting to selection...
                            </Typography>
                        </Box>
                    </Fade>
                )}
            </Container>
        </Box>
    );
};

export default LandingPage;
