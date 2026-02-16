import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, keyframes } from '@mui/material';
import xsLogo from '../assets/xs_square_light.png';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { setSelection, setGlobalStep, resetFlow } from '../store/selectionSlice';
import { useLanguage } from '../contexts/LanguageContext';

// Components
import OrgSelectionGrid from '../components/landing/OrgSelectionGrid';
import InfoForm from '../components/landing/InfoForm';
import OrgSetupForm from '../components/landing/OrgSetupForm';
import SuccessScreen from '../components/landing/SuccessScreen';
import ValidationToast from '../components/landing/ValidationToast';
import { School, Business, AccountBalance, Engineering, BusinessCenter } from '@mui/icons-material';
import type { OrgType, SelectedOrg, FormData, OrgFormData } from '../components/landing/types';

// --- Keyframes ---
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.2; }
  50% { opacity: 0.5; }
  90% { opacity: 0.2; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
`;

const RegistrationPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const step = useSelector((state: RootState) => state.selection.globalStep);
    const { t } = useLanguage();

    const [selectedOrg, setSelectedOrg] = useState<SelectedOrg | null>(null);

    // Form data states
    const [formData, setFormData] = useState<FormData>({
        contactName: '', designation: '', email: '', cellPhone: '',
        landline: '', website: '', address: '', city: '', state: '', postalCode: ''
    });

    const [orgData, setOrgData] = useState<OrgFormData>({
        institutionName: '', code: '', fiscalYear: '2024-25',
        visibility: { 'Academics': true, 'Admission': true, 'Human Resource': true, 'Fee Management': true, 'Dashboard': true },
        curriculum: '',
        affiliation: '',
        hecId: '',
        logo: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
    const [orgErrors, setOrgErrors] = useState<Partial<Record<keyof OrgFormData, boolean>>>({});
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Refs for focusing first empty field
    const fieldRefs = useRef<Partial<Record<keyof FormData, HTMLInputElement>>>({});
    const orgFieldRefs = useRef<Partial<Record<keyof OrgFormData, HTMLInputElement>>>({});

    useEffect(() => {
        // When entering registration, if state is hero, move to selection
        if (step === 'hero') {
            dispatch(setGlobalStep('selection'));
        }
    }, [dispatch, step]);

    const handleSelect = (type: OrgType, name: string, subtitle: string, description: string, color: string) => {
        setSelectedOrg({ type, name, subtitle, description, color });
        setOrgData(prev => ({ ...prev, institutionName: name }));
        dispatch(setSelection({ type, name, description }));
        dispatch(setGlobalStep('info'));
    };

    const validateForm = (): boolean => {
        const requiredFields = [
            { field: 'contactName', label: t('contact_person_name') },
            { field: 'email', label: t('email_address') },
            { field: 'cellPhone', label: t('cell_phone_number') },
            { field: 'address', label: t('address') },
            { field: 'city', label: t('city') }
        ];

        const newErrors: Partial<Record<keyof FormData, boolean>> = {};
        let firstErrorLabel = '';

        for (const { field, label } of requiredFields) {
            if (!formData[field as keyof FormData].trim()) {
                newErrors[field as keyof FormData] = true;
                if (!firstErrorLabel) firstErrorLabel = label;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = true;
            if (!firstErrorLabel) firstErrorLabel = t('valid_email_address');
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setToastMessage(`${t('please_fill_required_fields')}: ${firstErrorLabel}`);
            setToastOpen(true);

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

    const validateOrgForm = (): boolean => {
        const requiredFields = [
            { field: 'institutionName', label: `${selectedOrg?.name} ${t('name')}` },
            { field: 'code', label: t('organization_code') }
        ];

        if (selectedOrg?.type === 'school') requiredFields.push({ field: 'curriculum', label: t('curriculum') });
        if (selectedOrg?.type === 'college') requiredFields.push({ field: 'affiliation', label: t('affiliation_board') });
        if (selectedOrg?.type === 'university') requiredFields.push({ field: 'hecId', label: t('hec_id_registration_no') });

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
            setToastMessage(`${t('please_fill_required_fields')}: ${firstErrorLabel}`);
            setToastOpen(true);

            const firstEmptyField = requiredFields.find(f => newErrors[f.field as keyof OrgFormData]);
            if (firstEmptyField && orgFieldRefs.current[firstEmptyField.field as keyof OrgFormData]) {
                orgFieldRefs.current[firstEmptyField.field as keyof OrgFormData]?.focus();
            }
            return false;
        }
        return true;
    };

    const handleNextFromInfo = () => {
        if (validateForm()) {
            dispatch(setGlobalStep('organization'));
        }
    };

    const handleDone = () => {
        if (validateOrgForm()) {
            dispatch(setGlobalStep('complete'));
            setTimeout(() => {
                dispatch(resetFlow());
                navigate('/');
            }, 3000);
        }
    };

    const handleFormChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
    };

    const handleOrgFormChange = (field: keyof OrgFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrgData(prev => ({ ...prev, [field]: event.target.value }));
        if (orgErrors[field]) setOrgErrors(prev => ({ ...prev, [field]: false }));
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

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#edd8b4', position: 'relative', overflow: 'hidden' }}>
            {/* Animated Background Elements */}
            <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
                {[...Array(25)].map((_, i) => {
                    const icons = [School, Business, AccountBalance, Engineering, BusinessCenter];
                    const IconComp = icons[i % icons.length];
                    const size = Math.random() * 50 + 40;
                    const color = i % 2 === 0 ? '#f0dbb0' : '#76a345';
                    const rotation = Math.random() * 360;

                    return (
                        <Box
                            key={i}
                            sx={{
                                position: 'absolute',
                                left: `${Math.random() * 100}%`,
                                bottom: -200,
                                color: color,
                                opacity: 0.05,
                                animation: `${float} ${Math.random() * 20 + 20}s linear infinite`,
                                animationDelay: `${Math.random() * 30}s`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transform: `rotate(${rotation}deg)`,
                            }}
                        >
                            {i % 4 === 0 ? (
                                <Box
                                    component="img"
                                    src={xsLogo}
                                    sx={{
                                        width: size,
                                        height: size,
                                        objectFit: 'contain',
                                        filter: color === '#76a345' ? 'none' : 'brightness(0) invert(1)',
                                        opacity: 0.8
                                    }}
                                />
                            ) : (
                                <IconComp sx={{ fontSize: size }} />
                            )}
                        </Box>
                    );
                })}
            </Box>

            <Container
                maxWidth="lg"
                sx={{
                    position: 'relative',
                    zIndex: 10,
                    pt: 12,
                    pb: 8,
                    minHeight: '100vh'
                }}
            >
                {step === 'selection' && (
                    <OrgSelectionGrid onSelect={handleSelect} />
                )}

                {step === 'info' && selectedOrg && (
                    <InfoForm
                        selectedOrg={selectedOrg}
                        formData={formData}
                        errors={errors}
                        fieldRefs={fieldRefs}
                        onBack={() => dispatch(setGlobalStep('selection'))}
                        onNext={handleNextFromInfo}
                        onChange={handleFormChange}
                    />
                )}

                {step === 'organization' && selectedOrg && (
                    <OrgSetupForm
                        selectedOrg={selectedOrg}
                        orgData={orgData}
                        orgErrors={orgErrors}
                        orgFieldRefs={orgFieldRefs}
                        onBack={() => dispatch(setGlobalStep('info'))}
                        onDone={handleDone}
                        onChange={handleOrgFormChange}
                        onLogoUpload={handleLogoUpload}
                    />
                )}

                {step === 'complete' && <SuccessScreen />}
            </Container>

            <ValidationToast
                open={toastOpen}
                message={toastMessage}
                onClose={() => setToastOpen(false)}
            />
        </Box>
    );
};

export default RegistrationPage;
