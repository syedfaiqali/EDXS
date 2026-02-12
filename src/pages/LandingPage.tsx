import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Grid, Paper, keyframes, Button, TextField, MenuItem, Divider, Fade, Snackbar, Alert } from '@mui/material';
import {
    School, Business, AccountBalance, ChevronRight, ArrowBack, ArrowForward, CheckCircleOutline,
    HistoryEdu, Science, Calculate, Brush, Computer, Palette, Biotech, MenuBook,
    Settings, Landscape
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

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

interface OrgFormData {
    institutionName: string;
    code: string;
    fiscalYear: string;
    visibility: Record<string, boolean>;
    // Type specific fields
    curriculum?: string;
    affiliation?: string;
    hecId?: string;
    logo?: string;
}

const LandingPage: React.FC = () => {
    const [step, setStep] = useState<Step>('selection');
    const [logoStage, setLogoStage] = useState<'waiting' | 'opening' | 'finished'>('waiting');
    const [selectedOrg, setSelectedOrg] = useState<SelectedOrg | null>(null);
    const { language, t } = useLanguage();

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
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
    const [orgData, setOrgData] = useState<OrgFormData>({
        institutionName: '',
        code: '',
        fiscalYear: '2024-25',
        visibility: {
            'Academics': true,
            'Admission': true,
            'Human Resource': true,
            'Fee Management': true,
            'Dashboard': true
        },
        curriculum: '',
        affiliation: '',
        hecId: '',
        logo: ''
    });
    const [orgErrors, setOrgErrors] = useState<Partial<Record<keyof OrgFormData, boolean>>>({});

    // Refs for focusing first empty field
    const fieldRefs = useRef<Partial<Record<keyof FormData, HTMLInputElement>>>({});
    const orgFieldRefs = useRef<Partial<Record<keyof OrgFormData, HTMLInputElement>>>({});

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
        setOrgData(prev => ({ ...prev, institutionName: name }));
        setStep('info');
    };

    const handleFormChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: false
            }));
        }
    };

    const handleOrgFormChange = (field: keyof OrgFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setOrgData(prev => ({
            ...prev,
            [field]: value
        }));
        if (orgErrors[field]) {
            setOrgErrors(prev => ({
                ...prev,
                [field]: false
            }));
        }
    };


    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOrgData(prev => ({ ...prev, logo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = (): boolean => {
        const requiredFields = [
            { field: 'contactName', label: 'Contact Person Name' },
            { field: 'email', label: 'Email Address' },
            { field: 'cellPhone', label: 'Cell Phone Number' },
            { field: 'address', label: 'Address' },
            { field: 'city', label: 'City' }
        ];

        const newErrors: Partial<Record<keyof FormData, boolean>> = {};
        let firstErrorLabel = '';

        for (const { field, label } of requiredFields) {
            if (!formData[field as keyof FormData].trim()) {
                newErrors[field as keyof FormData] = true;
                if (!firstErrorLabel) firstErrorLabel = label;
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = true;
            if (!firstErrorLabel) firstErrorLabel = 'Valid Email Address';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setToastMessage(`Please fill in the required fields correctly: ${firstErrorLabel}`);
            setToastOpen(true);

            // Focus the first empty field
            const firstEmptyField = requiredFields.find(f => newErrors[f.field as keyof FormData]);
            if (firstEmptyField && fieldRefs.current[firstEmptyField.field as keyof FormData]) {
                fieldRefs.current[firstEmptyField.field as keyof FormData]?.focus();
            } else if (newErrors.email && fieldRefs.current.email) {
                fieldRefs.current.email.focus();
            }

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

    const validateOrgForm = (): boolean => {
        const requiredFields = [
            { field: 'institutionName', label: `${selectedOrg?.name} Name` },
            { field: 'code', label: 'Organization Code' }
        ];

        // Add type-specific validation if needed
        if (selectedOrg?.type === 'school') requiredFields.push({ field: 'curriculum', label: 'Curriculum' });
        if (selectedOrg?.type === 'college') requiredFields.push({ field: 'affiliation', label: 'Affiliation Board' });
        if (selectedOrg?.type === 'university') requiredFields.push({ field: 'hecId', label: 'HEC ID' });

        const newErrors: Partial<Record<keyof OrgFormData, boolean>> = {};
        let firstErrorLabel = '';

        for (const { field, label } of requiredFields) {
            if (!orgData[field as keyof OrgFormData]?.toString().trim()) {
                newErrors[field as keyof OrgFormData] = true;
                if (!firstErrorLabel) firstErrorLabel = label;
            }
        }

        setOrgErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setToastMessage(`Please fill in the required fields correctly: ${firstErrorLabel}`);
            setToastOpen(true);

            // Focus the first empty field
            const firstEmptyField = requiredFields.find(f => newErrors[f.field as keyof OrgFormData]);
            if (firstEmptyField && orgFieldRefs.current[firstEmptyField.field as keyof OrgFormData]) {
                orgFieldRefs.current[firstEmptyField.field as keyof OrgFormData]?.focus();
            }

            return false;
        }

        return true;
    };

    const handleDone = () => {
        if (validateOrgForm()) {
            setStep('complete');
            setTimeout(() => {
                // Reset to selection after showing success
                setStep('selection');
                setSelectedOrg(null);
                // Clear data
                setFormData({
                    contactName: '', designation: '', email: '', cellPhone: '',
                    landline: '', website: '', address: '', city: '', state: '', postalCode: ''
                });
                setOrgData({
                    institutionName: '', code: '', fiscalYear: '2024-25',
                    visibility: { 'Academics': true, 'Admission': true, 'Human Resource': true, 'Fee Management': true, 'Dashboard': true }
                });
                setErrors({});
                setOrgErrors({});
            }, 3000);
        }
    };


    const cards = [
        {
            type: 'school' as const,
            name: t('school'),
            subtitle: t('school_subtitle'),
            description: t('school_desc'),
            icon: <School sx={{ fontSize: 40 }} />,
            color: '#76a345',
            lightColor: '#eef6e3',
        },
        {
            type: 'college' as const,
            name: t('college'),
            subtitle: t('college_subtitle'),
            description: t('college_desc'),
            icon: <Business sx={{ fontSize: 40 }} />,
            color: '#76a345',
            lightColor: '#eef6e3',
        },
        {
            type: 'university' as const,
            name: t('university'),
            subtitle: t('univ_subtitle'),
            description: t('univ_desc'),
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
                        direction: 'ltr'
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
                                    {t('welcome')}
                                </Typography>
                                <Typography variant="h6" color="text.secondary" fontWeight="400">
                                    {t('select_org')}
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
                                                    {t('enter_module')}
                                                </Typography>
                                                <ChevronRight sx={{ ml: 1, color: card.color, ...(language !== 'English' && { transform: 'rotate(180deg)' }) }} />
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

                            <Paper sx={{ p: 6, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.95)' }}>
                                <Button
                                    startIcon={<ArrowBack />}
                                    onClick={() => setStep('selection')}
                                    sx={{ mb: 4 }}
                                >
                                    {t('back_to_selection')}
                                </Button>
                                <Typography variant="h2" gutterBottom color="primary">
                                    {selectedOrg.name} {t('information')}
                                </Typography>
                                <Typography variant="body1" paragraph color="text.secondary">
                                    {selectedOrg.description}
                                </Typography>

                                <Divider sx={{ my: 4 }} />

                                <Typography variant="h3" gutterBottom>
                                    {t('basic_information')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    {t('please_provide_the_following_details_to_set_up_your')} {selectedOrg.name}.
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label={t('contact_person_name')}
                                            placeholder="John Doe"
                                            required
                                            value={formData.contactName}
                                            onChange={handleFormChange('contactName')}
                                            error={!!errors.contactName}
                                            inputProps={{ maxLength: 50 }}
                                            inputRef={(el: HTMLInputElement) => { fieldRefs.current.contactName = el; }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label={t('designation')}
                                            placeholder="Principal / Director"
                                            value={formData.designation}
                                            onChange={handleFormChange('designation')}
                                            inputProps={{ maxLength: 50 }}
                                            inputRef={(el: HTMLInputElement) => { fieldRefs.current.designation = el; }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label={t('email_address')}
                                            type="email"
                                            placeholder="contact@example.com"
                                            required
                                            value={formData.email}
                                            onChange={handleFormChange('email')}
                                            error={!!errors.email}
                                            inputProps={{ maxLength: 100 }}
                                            inputRef={(el: HTMLInputElement) => { fieldRefs.current.email = el; }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label={t('cell_phone_number')}
                                            type="tel"
                                            placeholder="+92 300 1234567"
                                            required
                                            value={formData.cellPhone}
                                            onChange={handleFormChange('cellPhone')}
                                            error={!!errors.cellPhone}
                                            inputProps={{ maxLength: 20 }}
                                            inputRef={(el: HTMLInputElement) => { fieldRefs.current.cellPhone = el; }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label={t('landline_number')}
                                            type="tel"
                                            placeholder="+92 21 12345678"
                                            value={formData.landline}
                                            onChange={handleFormChange('landline')}
                                            inputProps={{ maxLength: 20 }}
                                            inputRef={(el: HTMLInputElement) => { fieldRefs.current.landline = el; }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label={t('website')}
                                            type="url"
                                            placeholder="www.example.com"
                                            value={formData.website}
                                            onChange={handleFormChange('website')}
                                            inputProps={{ maxLength: 100 }}
                                            inputRef={(el: HTMLInputElement) => { fieldRefs.current.website = el; }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label={t('address')}
                                            placeholder={t('street_address')}
                                            multiline
                                            rows={2}
                                            required
                                            value={formData.address}
                                            onChange={handleFormChange('address')}
                                            error={!!errors.address}
                                            inputProps={{ maxLength: 250 }}
                                            inputRef={(el: HTMLInputElement) => { fieldRefs.current.address = el; }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            fullWidth
                                            label={t('city')}
                                            placeholder={t('karachi')}
                                            required
                                            value={formData.city}
                                            onChange={handleFormChange('city')}
                                            error={!!errors.city}
                                            inputProps={{ maxLength: 50 }}
                                            inputRef={(el: HTMLInputElement) => { fieldRefs.current.city = el; }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            fullWidth
                                            label={t('state_province')}
                                            placeholder={t('sindh')}
                                            value={formData.state}
                                            onChange={handleFormChange('state')}
                                            inputProps={{ maxLength: 50 }}
                                            inputRef={(el: HTMLInputElement) => { fieldRefs.current.state = el; }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            fullWidth
                                            label={t('postal_code')}
                                            placeholder={t('75500')}
                                            value={formData.postalCode}
                                            onChange={handleFormChange('postalCode')}
                                            inputProps={{ maxLength: 15 }}
                                            inputRef={(el: HTMLInputElement) => { if (el) fieldRefs.current.postalCode = el; }}
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForward sx={{ ...(language !== 'English' && { transform: 'rotate(180deg)' }) }} />}
                                        onClick={handleNextFromInfo}
                                    >
                                        {t('next')}
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

                            <Paper sx={{ p: 6, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.95)' }}>
                                <Button
                                    startIcon={<ArrowBack sx={{ ...(language !== 'English' && { transform: 'rotate(180deg)' }) }} />}
                                    onClick={() => setStep('info')}
                                    sx={{ mb: 4 }}
                                >
                                    {t('back')}
                                </Button>
                                <Typography variant="h2" gutterBottom color="primary">
                                    {selectedOrg.name} {t('organization_setup')}
                                </Typography>
                                <Typography variant="body1" paragraph color="text.secondary">
                                    {t('configure_the_core_settings_and_branding_for_your')} {selectedOrg.name.toLowerCase()}.
                                </Typography>

                                <Divider sx={{ my: 4 }} />

                                <Grid container spacing={6}>
                                    <Grid size={{ xs: 12, md: 7 }}>
                                        <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Settings color="primary" sx={{ mr: 1.5 }} />
                                            {t('core_settings')}
                                        </Typography>

                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    label={`${selectedOrg.name} ${t('name')}`}
                                                    value={orgData.institutionName}
                                                    onChange={handleOrgFormChange('institutionName')}
                                                    error={!!orgErrors.institutionName}
                                                    inputProps={{ maxLength: 100 }}
                                                    inputRef={(el: HTMLInputElement) => { if (el) orgFieldRefs.current.institutionName = el; }}
                                                    required
                                                />
                                            </Grid>

                                            {selectedOrg.type === 'school' && (
                                                <Grid size={{ xs: 12 }}>
                                                    <TextField
                                                        fullWidth
                                                        label={t('curriculum')}
                                                        placeholder={t('curriculum_placeholder')}
                                                        value={orgData.curriculum}
                                                        onChange={handleOrgFormChange('curriculum')}
                                                        error={!!orgErrors.curriculum}
                                                        inputRef={(el: HTMLInputElement) => { if (el) orgFieldRefs.current.curriculum = el; }}
                                                        required
                                                    />
                                                </Grid>
                                            )}

                                            {selectedOrg.type === 'college' && (
                                                <Grid size={{ xs: 12 }}>
                                                    <TextField
                                                        fullWidth
                                                        label={t('affiliation_board')}
                                                        placeholder={t('affiliation_placeholder')}
                                                        value={orgData.affiliation}
                                                        onChange={handleOrgFormChange('affiliation')}
                                                        error={!!orgErrors.affiliation}
                                                        inputRef={(el: HTMLInputElement) => { if (el) orgFieldRefs.current.affiliation = el; }}
                                                        required
                                                    />
                                                </Grid>
                                            )}

                                            {selectedOrg.type === 'university' && (
                                                <Grid size={{ xs: 12 }}>
                                                    <TextField
                                                        fullWidth
                                                        label={t('hec_id_registration_no')}
                                                        placeholder={t('hec_id_placeholder')}
                                                        value={orgData.hecId}
                                                        onChange={handleOrgFormChange('hecId')}
                                                        error={!!orgErrors.hecId}
                                                        inputRef={(el: HTMLInputElement) => { if (el) orgFieldRefs.current.hecId = el; }}
                                                        required
                                                    />
                                                </Grid>
                                            )}

                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label={t('organization_code')}
                                                    placeholder="EB-2024"
                                                    value={orgData.code}
                                                    onChange={handleOrgFormChange('code')}
                                                    error={!!orgErrors.code}
                                                    inputProps={{ maxLength: 20 }}
                                                    inputRef={(el: HTMLInputElement) => { if (el) orgFieldRefs.current.code = el; }}
                                                    required
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    label={t('fiscal_year')}
                                                    value={orgData.fiscalYear}
                                                    onChange={handleOrgFormChange('fiscalYear')}
                                                >
                                                    <MenuItem value="2023-24">2023-24</MenuItem>
                                                    <MenuItem value="2024-25">2024-25</MenuItem>
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 5 }}>
                                        <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Palette color="primary" sx={{ mr: 1.5 }} />
                                            {t('branding')}
                                        </Typography>

                                        <Box
                                            sx={{
                                                border: '2px dashed',
                                                borderColor: orgData.logo ? selectedOrg.color : 'rgba(0,0,0,0.1)',
                                                borderRadius: 4,
                                                p: 4,
                                                textAlign: 'center',
                                                backgroundColor: orgData.logo ? `${selectedOrg.color}05` : 'rgba(0,0,0,0.02)',
                                                minHeight: 280,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    borderColor: selectedOrg.color,
                                                    bgcolor: `${selectedOrg.color} 10`
                                                }
                                            }}
                                            component="label"
                                        >
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                            />
                                            {orgData.logo ? (
                                                <Box sx={{ position: 'relative', width: '100%' }}>
                                                    <img
                                                        src={orgData.logo}
                                                        alt="Logo Preview"
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '200px',
                                                            objectFit: 'contain',
                                                            borderRadius: '8px'
                                                        }}
                                                    />
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: selectedOrg.color, fontWeight: 700 }}>
                                                        {t('click_to_change_logo')}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <>
                                                    <Box sx={{
                                                        width: 80,
                                                        height: 80,
                                                        borderRadius: '50%',
                                                        bgcolor: `${selectedOrg.color} 15`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mb: 2
                                                    }}>
                                                        <Landscape sx={{ fontSize: 40, color: selectedOrg.color }} />
                                                    </Box>
                                                    <Typography variant="body1" fontWeight="600" gutterBottom>
                                                        {t('upload_logo')}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {t('drag_and_drop_or_click_to_browse')}
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>

                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<CheckCircleOutline />}
                                        onClick={handleDone}
                                        sx={{ px: 6 }}
                                    >
                                        {t('complete_setup')}
                                    </Button>
                                </Box>
                            </Paper>
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
                                {t('configuration_complete')}
                            </Typography>
                            <Typography variant="h5" color="text.secondary">
                                {t('redirecting_to_selection')}
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
                                ⚡ {t('validation_required')}
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
