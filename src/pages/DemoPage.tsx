import React, { useState } from 'react';
import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material';
import { ArrowBack, CheckCircleOutline, PlayCircleOutline } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { submitDemoEnquiry } from '../api/admission';

interface DemoForm {
    fullName: string;
    email: string;
    phone: string;
    organisationName: string;
    numberOfPersons: string;
    message: string;
}

const emptyForm: DemoForm = {
    fullName: '',
    email: '',
    phone: '',
    organisationName: '',
    numberOfPersons: '1',
    message: ''
};

const DemoPage: React.FC = () => {
    const [form, setForm] = useState<DemoForm>(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [reference, setReference] = useState('');
    const [toast, setToast] = useState({ open: false, message: '' });

    const showError = (message: string) => setToast({ open: true, message });

    const update = (field: keyof DemoForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm(current => ({ ...current, [field]: event.target.value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.numberOfPersons.trim()) {
            showError('Please fill in all required fields.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            showError('Please enter a valid email address.');
            return;
        }

        if (!Number.isInteger(Number(form.numberOfPersons)) || Number(form.numberOfPersons) < 1) {
            showError('Number of persons must be at least 1.');
            return;
        }

        setSubmitting(true);
        try {
            const result = await submitDemoEnquiry({
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                organisationName: form.organisationName.trim(),
                numberOfPersons: Number(form.numberOfPersons),
                message: form.message.trim(),
                entityId: Number(
                    (import.meta as { env?: Record<string, string> }).env
                        ?.VITE_DEMO_ADMISSION_ENTITY_ID ?? '1'
                ) || 1
            });
            setReference(result.token);
            setForm(emptyForm);
        } catch (submissionError) {
            showError(
                submissionError instanceof Error
                    ? submissionError.message
                    : 'We could not send your demo request. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#e9efdd', pt: { xs: 13, md: 17 }, pb: 9 }}>
            <Container maxWidth="lg">
                <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
                    <Box sx={{ pb: { xs: 4, md: 5 }, borderBottom: '1px solid rgba(111,150,63,0.22)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, color: 'primary.main', mb: 1.25 }}>
                            <PlayCircleOutline />
                            <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1.4 }}>
                                PERSONALISED WALKTHROUGH
                            </Typography>
                        </Box>
                        <Typography variant="h2" sx={{ color: 'primary.dark', fontWeight: 900, fontSize: { xs: '2.4rem', md: '4rem' }, lineHeight: 1 }}>
                            Book a demo
                        </Typography>
                        <Typography sx={{ mt: 1.5, maxWidth: 680, color: 'text.secondary', fontSize: { xs: '1rem', md: '1.15rem' } }}>
                            Tell us a little about yourself and our team will arrange an EDXS walkthrough for you.
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ py: { xs: 4, md: 5 } }}>
                        {reference ? (
                            <Alert icon={<CheckCircleOutline fontSize="inherit" />} severity="success" sx={{ mb: 3 }}>
                                Your demo request has been received. Reference: <strong>{reference}</strong>
                            </Alert>
                        ) : null}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 2.5 } }}>
                            <TextField label="Full name" required value={form.fullName} onChange={update('fullName')} autoComplete="name" slotProps={{ htmlInput: { maxLength: 50 } }} />
                            <TextField label="Work email" required type="email" value={form.email} onChange={update('email')} autoComplete="email" slotProps={{ htmlInput: { maxLength: 100 } }} />
                            <TextField label="Phone number" required value={form.phone} onChange={update('phone')} autoComplete="tel" slotProps={{ htmlInput: { maxLength: 15 } }} />
                            <TextField label="School / organisation" value={form.organisationName} onChange={update('organisationName')} autoComplete="organization" slotProps={{ htmlInput: { maxLength: 700 } }} />
                            <TextField
                                label="No. of persons"
                                required
                                type="number"
                                value={form.numberOfPersons}
                                onChange={update('numberOfPersons')}
                                slotProps={{ htmlInput: { min: 1, max: 2147483647, step: 1 } }}
                            />
                            <TextField label="What would you like to explore?" value={form.message} onChange={update('message')} multiline minRows={4} slotProps={{ htmlInput: { maxLength: 700 } }} sx={{ gridColumn: { sm: '1 / -1' } }} />
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2, mt: 4 }}>
                            <Button component={RouterLink} to="/" startIcon={<ArrowBack />} color="inherit" sx={{ color: 'text.secondary' }}>
                                Back to home
                            </Button>
                            <Button type="submit" variant="contained" disabled={submitting} sx={{ minWidth: 170, py: 1.35, fontWeight: 800 }}>
                                {submitting ? 'Sending request…' : 'Request a demo'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
            <Snackbar
                open={toast.open}
                autoHideDuration={5000}
                onClose={() => setToast(current => ({ ...current, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error" variant="filled" onClose={() => setToast(current => ({ ...current, open: false }))}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DemoPage;
