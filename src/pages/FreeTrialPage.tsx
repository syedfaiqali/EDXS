import React, { useRef, useState } from 'react';
import { Box, Container, keyframes, Typography } from '@mui/material';
import {
    School, Business, AccountBalance, Engineering, BusinessCenter,
    MenuBook, Calculate, Functions, HistoryEdu, Science,
    AutoStories, Psychology, Architecture, Language, Draw
} from '@mui/icons-material';
import xsLogo from '../assets/xs_square_light.webp';
import { useLanguage } from '../contexts/LanguageContext';

import OrgSelectionGrid from '../components/landing/OrgSelectionGrid';
import TrialSignupForm from '../components/landing/TrialSignupForm';
import { emptyTrialForm } from '../components/landing/trialFormData';
import type { TrialFormData } from '../components/landing/trialFormData';
import TrialSuccessScreen from '../components/landing/TrialSuccessScreen';
import ValidationToast from '../components/landing/ValidationToast';
import type { OrgType, SelectedOrg } from '../components/landing/types';
import { TRIAL_DAYS, startFreeTrial } from '../api/trial';
import type { TrialLookup, TrialSignupResult } from '../api/trial';

const drift = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(20px, -20px) rotate(3deg); }
  66% { transform: translate(-15px, 15px) rotate(-3deg); }
`;

type TrialStep = 'selection' | 'form' | 'complete';

/**
 * The free trial sign-up, kept separate from `/registration` so the demo
 * enquiry flow and the trial that creates a real account cannot be confused
 * for one another. The organisation picker is shared with the demo flow; the
 * form after it collects what the back office's New Client screen needs.
 */
const FreeTrialPage: React.FC = () => {
    const { t } = useLanguage();

    const [step, setStep] = useState<TrialStep>('selection');
    const [selectedOrg, setSelectedOrg] = useState<SelectedOrg | null>(null);
    const [data, setData] = useState<TrialFormData>(emptyTrialForm);
    const [moduleIds, setModuleIds] = useState<number[]>([]);
    const [errors, setErrors] = useState<Partial<Record<keyof TrialFormData, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [result, setResult] = useState<TrialSignupResult | null>(null);
    const [toast, setToast] = useState({ open: false, message: '' });

    const fieldRefs = useRef<Partial<Record<keyof TrialFormData, HTMLInputElement>>>({});

    const handleSelect = (type: OrgType, name: string, subtitle: string, description: string, color: string) => {
        setSelectedOrg({ type, name, subtitle, description, color });
        setStep('form');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleChange = (field: keyof TrialFormData, value: string) => {
        setData(previous => {
            // A country or state change invalidates what hung off it, otherwise
            // a stale city would be submitted against a different state.
            if (field === 'country') return { ...previous, country: value, state: '', city: '' };
            if (field === 'state') return { ...previous, state: value, city: '' };
            return { ...previous, [field]: value };
        });

        if (errors[field]) {
            setErrors(previous => ({ ...previous, [field]: undefined }));
        }
    };

    /**
     * Validates the form and reports the first problem, focusing the field it
     * belongs to. Required fields mirror the ones the server rejects a client
     * without, plus the password rules, which only exist on this form.
     */
    const validate = (): boolean => {
        const required: Array<{ field: keyof TrialFormData; label: string }> = [
            { field: 'clientName', label: t('client_name') },
            { field: 'campusName', label: t('campus_name') },
            { field: 'contactPerson', label: t('contact_person') },
            { field: 'contactNo', label: t('contact_no') },
            { field: 'email', label: t('email_address') },
            { field: 'country', label: t('country') },
            { field: 'state', label: t('state') },
            { field: 'city', label: t('city') },
            { field: 'address', label: t('address') },
            { field: 'userName', label: t('username') },
            { field: 'password', label: t('password') },
            { field: 'confirmPassword', label: t('confirm_password') }
        ];

        const found: Partial<Record<keyof TrialFormData, string>> = {};
        let firstLabel = '';
        let firstField: keyof TrialFormData | null = null;

        for (const { field, label } of required) {
            if (!data[field].trim()) {
                found[field] = t('field_required');
                if (!firstField) { firstField = field; firstLabel = label; }
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email.trim() && !emailRegex.test(data.email.trim())) {
            found.email = t('valid_email_address');
            if (!firstField) { firstField = 'email'; firstLabel = t('valid_email_address'); }
        }

        if (data.password && data.password.length < 8) {
            found.password = t('password_too_short');
            if (!firstField) { firstField = 'password'; firstLabel = t('password'); }
        }

        if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
            found.confirmPassword = t('passwords_do_not_match');
            if (!firstField) { firstField = 'confirmPassword'; firstLabel = t('confirm_password'); }
        }

        setErrors(found);

        if (firstField) {
            setToast({ open: true, message: `${t('please_fill_required_fields')}: ${firstLabel}` });
            fieldRefs.current[firstField]?.focus();
            return false;
        }

        return true;
    };

    /**
     * Creates the trial. `modules` is handed in by the form because it owns the
     * loaded list; when the visitor picked none, every module the deployment
     * offers is enabled, so a trial is never created with nothing to look at.
     */
    const handleSubmit = async (modules: TrialLookup[]) => {
        if (!validate()) return;

        setSubmitting(true);
        setSubmitError('');

        try {
            const created = await startFreeTrial({
                clientName: data.clientName,
                description: data.description,
                contactPerson: data.contactPerson,
                contactNo: data.contactNo,
                email: data.email,
                address: data.address,
                country: data.country,
                state: data.state,
                city: data.city,
                campusName: data.campusName,
                userName: data.userName,
                password: data.password,
                fullName: data.fullName,
                mobile: data.mobile,
                moduleIds: moduleIds.length > 0 ? moduleIds : modules.map(module => module.id)
            });

            setResult(created);
            setStep('complete');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            setSubmitError((error as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#e9efdd', position: 'relative', overflow: 'hidden', mt: 5 }}>
            {/* The same drifting backdrop as the registration flow, so the two
                entry points read as one site. */}
            <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
                {[...Array(80)].map((_, i) => {
                    const icons = [
                        School, Business, AccountBalance, Engineering, BusinessCenter,
                        MenuBook, Calculate, Functions, HistoryEdu, Science,
                        AutoStories, Psychology, Architecture, Language, Draw
                    ];
                    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'π', 'Σ', '√'];

                    const isLogo = i % 8 === 0;
                    const isNumber = !isLogo && i % 3 === 0;
                    const IconComp = icons[i % icons.length];
                    const numChar = numbers[i % numbers.length];
                    const size = isNumber ? Math.random() * 40 + 30 : Math.random() * 50 + 40;
                    const color = i % 2 === 0 ? '#dce9cb' : '#6f963f';

                    return (
                        <Box
                            key={i}
                            sx={{
                                position: 'absolute',
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                color,
                                opacity: i % 3 === 0 ? 0.12 : 0.06,
                                animation: `${drift} ${Math.random() * 15 + 10}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * -20}s`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                zIndex: 0
                            }}
                        >
                            {isLogo ? (
                                <Box
                                    component="img"
                                    src={xsLogo}
                                    sx={{
                                        width: size,
                                        height: size,
                                        objectFit: 'contain',
                                        filter: color === '#6f963f' ? 'none' : 'brightness(0) invert(1)',
                                        opacity: 0.5
                                    }}
                                />
                            ) : isNumber ? (
                                <Typography sx={{
                                    fontSize: `${size}px`,
                                    fontWeight: 900,
                                    fontFamily: '"Outfit", sans-serif',
                                    lineHeight: 1
                                }}>
                                    {numChar}
                                </Typography>
                            ) : (
                                <IconComp sx={{ fontSize: size }} />
                            )}
                        </Box>
                    );
                })}
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10, pt: 12, pb: 8, minHeight: '100vh' }}>
                {step === 'selection' && (
                    // Squared off to match the form the cards lead to. The grid
                    // is styled from here so the shared component keeps the
                    // rounded look wherever else it is used.
                    <Box sx={{ '& .MuiPaper-root': { borderRadius: 0 }, '& .icon-box': { borderRadius: 0 } }}>
                        <Typography
                            variant="h5"
                            textAlign="center"
                            sx={{ color: '#4c6b2a', fontWeight: 700, mb: 1 }}
                        >
                            {t('select_org_for_trial', { days: String(TRIAL_DAYS) })}
                        </Typography>
                        <OrgSelectionGrid onSelect={handleSelect} />
                    </Box>
                )}

                {step === 'form' && selectedOrg && (
                    <TrialSignupForm
                        selectedOrg={selectedOrg}
                        data={data}
                        errors={errors}
                        moduleIds={moduleIds}
                        submitting={submitting}
                        submitError={submitError}
                        fieldRefs={fieldRefs}
                        onBack={() => setStep('selection')}
                        onChange={handleChange}
                        onModulesChange={setModuleIds}
                        onSubmit={handleSubmit}
                    />
                )}

                {step === 'complete' && result && <TrialSuccessScreen result={result} />}
            </Container>

            <ValidationToast
                open={toast.open}
                message={toast.message}
                onClose={() => setToast(previous => ({ ...previous, open: false }))}
            />
        </Box>
    );
};

export default FreeTrialPage;
