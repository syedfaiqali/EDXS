import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, keyframes, Button, TextField, MenuItem, Switch, FormControlLabel, Divider, Fade, Snackbar, Alert } from '@mui/material';
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

interface FormData {
    contactName: string;
    designation: string;
    email: string;
    cellPhone: string;
    landline: string;
    website: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
}

const LandingPage: React.FC = () => {
    const [step, setStep] = useState<Step>('selection');
    const [logoStage, setLogoStage] = useState<'waiting' | 'opening' | 'finished'>('waiting');
    const [selectedOrg, setSelectedOrg] = useState<SelectedOrg | null>(null);
    const [formData, setFormData] = useState<FormData>({
        contactName: '',
        designation: '',
        email: '',
        cellPhone: '',
        landline: '',
        website: '',
        address: '',
        city: '',
        state: '',
        postalCode: ''
    });
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

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

    const handleFormChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const validateForm = (): boolean => {
        const requiredFields = [
            { field: 'contactName', label: 'Contact Person Name' },
            { field: 'email', label: 'Email Address' },
            { field: 'cellPhone', label: 'Cell Phone Number' },
            { field: 'address', label: 'Address' },
            { field: 'city', label: 'City' }
        ];

        for (const { field, label } of requiredFields) {
            if (!formData[field as keyof FormData].trim()) {
                setToastMessage(`Please fill in the required field: ${label}`);
                setToastOpen(true);
                return false;
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setToastMessage('Please enter a valid email address');
            setToastOpen(true);
            return false;
        }

        return true;
    };

    const handleNextFromInfo = () => {
        if (validateForm()) {
            setStep('organization');
        }
    };

    const handleCloseToast = () => {
        setToastOpen(false);
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
                                    Basic Information
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Please provide the following details to set up your {selectedOrg.name}.
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Contact Person Name"
                                                placeholder="John Doe"
                                                required
                                                value={formData.contactName}
                                                onChange={handleFormChange('contactName')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Designation"
                                                placeholder="Principal / Director"
                                                value={formData.designation}
                                                onChange={handleFormChange('designation')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                type="email"
                                                placeholder="contact@example.com"
                                                required
                                                value={formData.email}
                                                onChange={handleFormChange('email')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Cell Phone Number"
                                                type="tel"
                                                placeholder="+92 300 1234567"
                                                required
                                                value={formData.cellPhone}
                                                onChange={handleFormChange('cellPhone')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Landline Number"
                                                type="tel"
                                                placeholder="+92 21 12345678"
                                                value={formData.landline}
                                                onChange={handleFormChange('landline')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Website"
                                                type="url"
                                                placeholder="www.example.com"
                                                value={formData.website}
                                                onChange={handleFormChange('website')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label="Address"
                                                placeholder="Street Address"
                                                multiline
                                                rows={2}
                                                required
                                                value={formData.address}
                                                onChange={handleFormChange('address')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <TextField
                                                fullWidth
                                                label="City"
                                                placeholder="Karachi"
                                                required
                                                value={formData.city}
                                                onChange={handleFormChange('city')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <TextField
                                                fullWidth
                                                label="State/Province"
                                                placeholder="Sindh"
                                                value={formData.state}
                                                onChange={handleFormChange('state')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <TextField
                                                fullWidth
                                                label="Postal Code"
                                                placeholder="75500"
                                                value={formData.postalCode}
                                                onChange={handleFormChange('postalCode')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForward />}
                                        onClick={handleNextFromInfo}
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

            {/* Unique Attractive Toast Notification - EDXS Green Theme */}
            <Snackbar
                open={toastOpen}
                autoHideDuration={5000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionProps={{
                    enter: true,
                    exit: true,
                }}
                sx={{
                    mt: 10,
                    mr: 2
                }}
            >
                <Alert
                    onClose={handleCloseToast}
                    severity="error"
                    variant="filled"
                    icon={false}
                    sx={{
                        minWidth: '380px',
                        background: 'linear-gradient(135deg, #76a345 0%, #5a7d34 100%)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 4,
                        border: '2px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 16px 48px rgba(118, 163, 69, 0.5), 0 0 24px rgba(118, 163, 69, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: 'slideInRight 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), pulse 2.5s ease-in-out infinite',
                        '@keyframes slideInRight': {
                            '0%': {
                                transform: 'translateX(120%) scale(0.8)',
                                opacity: 0
                            },
                            '100%': {
                                transform: 'translateX(0) scale(1)',
                                opacity: 1
                            }
                        },
                        '@keyframes pulse': {
                            '0%, 100%': {
                                boxShadow: '0 16px 48px rgba(118, 163, 69, 0.5), 0 0 24px rgba(118, 163, 69, 0.3)'
                            },
                            '50%': {
                                boxShadow: '0 16px 48px rgba(118, 163, 69, 0.7), 0 0 36px rgba(118, 163, 69, 0.5)'
                            }
                        },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                            animation: 'shimmer 3s infinite',
                        },
                        '@keyframes shimmer': {
                            '0%': { left: '-100%' },
                            '100%': { left: '100%' }
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: -2,
                            left: -2,
                            right: -2,
                            bottom: -2,
                            background: 'linear-gradient(45deg, #76a345, #94bc65, #76a345)',
                            borderRadius: 4,
                            zIndex: -1,
                            opacity: 0.6,
                            filter: 'blur(8px)',
                        },
                        '& .MuiAlert-message': {
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            position: 'relative',
                            zIndex: 1,
                            py: 1
                        },
                        '& .MuiAlert-action': {
                            position: 'relative',
                            zIndex: 1,
                            '& .MuiIconButton-root': {
                                color: 'rgba(255,255,255,0.9)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    transform: 'rotate(90deg)',
                                    transition: 'all 0.3s ease'
                                }
                            }
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, width: '100%' }}>
                        {/* Custom Animated Icon */}
                        <Box sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                            border: '2px solid rgba(255,255,255,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            animation: 'bounce 1s ease-in-out infinite',
                            '@keyframes bounce': {
                                '0%, 100%': {
                                    transform: 'translateY(0) scale(1)',
                                },
                                '50%': {
                                    transform: 'translateY(-8px) scale(1.05)',
                                }
                            }
                        }}>
                            <Typography sx={{
                                fontSize: '2rem',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                            }}>
                                ⚠️
                            </Typography>
                        </Box>

                        {/* Message Content */}
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{
                                fontWeight: 800,
                                fontSize: '1.05rem',
                                color: '#fff',
                                mb: 0.5,
                                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                letterSpacing: '0.3px'
                            }}>
                                ⚡ Validation Required
                            </Typography>
                            <Typography sx={{
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.95)',
                                lineHeight: 1.5,
                                fontWeight: 500,
                                textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                            }}>
                                {toastMessage}
                            </Typography>
                        </Box>
                    </Box>
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LandingPage;
