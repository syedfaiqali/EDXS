import React, { useState } from 'react';
import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material';
import { ArrowBack, CheckCircleOutline, PlayCircleOutline } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { submitDemoEnquiry } from '../api/admission';

interface DemoForm {
    collectedBy: string;
    email: string;
    phone: string;
    organisationName: string;
    contactPerson: string;
    city: string;
    numberOfCampuses: string;
    studentStrength: string;
    citiesOfOperation: string;
    interestedIn: string[];
    notes: string;
}

const emptyForm: DemoForm = {
    collectedBy: '',
    email: '',
    phone: '',
    organisationName: '',
    contactPerson: '',
    city: '',
    numberOfCampuses: '',
    studentStrength: '',
    citiesOfOperation: '',
    interestedIn: [],
    notes: ''
};

const interestOptions = [
    'EDXS School ERP',
    'EDXS LMS',
    'IT Hardware',
    'Security (CCTV/Biometric)',
    'Managed Services / SLA'
];

const asOptionalPositiveNumber = (value: string): number | null => {
    const number = Number(value);
    return Number.isInteger(number) && number > 0 ? number : null;
};

const leadSummary = (form: DemoForm): string => [
    `Collected by: ${form.collectedBy.trim()}`,
    `Contact person: ${form.contactPerson.trim()}`,
    `City: ${form.city.trim()}`,
    form.numberOfCampuses.trim() ? `Number of campuses: ${form.numberOfCampuses.trim()}` : '',
    form.studentStrength.trim() ? `Student strength: ${form.studentStrength.trim()}` : '',
    form.citiesOfOperation.trim() ? `Cities of operation: ${form.citiesOfOperation.trim()}` : '',
    form.interestedIn.length ? `Interested in: ${form.interestedIn.join(', ')}` : '',
    form.notes.trim() ? `Notes: ${form.notes.trim()}` : ''
].filter(Boolean).join('\n');

const DemoPage: React.FC = () => {
    const [form, setForm] = useState<DemoForm>(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [reference, setReference] = useState('');
    const [toast, setToast] = useState({ open: false, message: '' });

    const showError = (message: string) => setToast({ open: true, message });

    const update = (field: keyof DemoForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm(current => ({ ...current, [field]: event.target.value }));
    };

    const toggleInterest = (interest: string) => {
        setForm(current => ({
            ...current,
            interestedIn: current.interestedIn.includes(interest)
                ? current.interestedIn.filter(item => item !== interest)
                : [...current.interestedIn, interest]
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!form.collectedBy.trim() || !form.organisationName.trim() || !form.contactPerson.trim() || !form.phone.trim() || !form.city.trim()) {
            showError('Please fill in all required fields.');
            return;
        }

        if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            showError('Please enter a valid email address.');
            return;
        }

        if (form.numberOfCampuses.trim() && !asOptionalPositiveNumber(form.numberOfCampuses)) {
            showError('Number of campuses must be at least 1.');
            return;
        }

        if (form.studentStrength.trim() && !asOptionalPositiveNumber(form.studentStrength)) {
            showError('Student strength must be at least 1.');
            return;
        }

        setSubmitting(true);
        try {
            const result = await submitDemoEnquiry({
                fullName: form.contactPerson.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                organisationName: form.organisationName.trim(),
                // The existing endpoint requires this field. Student strength
                // is the closest lead-capture equivalent; one is a safe
                // fallback when the optional value is not supplied.
                numberOfPersons: asOptionalPositiveNumber(form.studentStrength) ?? 1,
                message: leadSummary(form),
                collectedBy: form.collectedBy.trim(),
                contactPerson: form.contactPerson.trim(),
                city: form.city.trim(),
                numberOfCampuses: asOptionalPositiveNumber(form.numberOfCampuses),
                studentStrength: asOptionalPositiveNumber(form.studentStrength),
                citiesOfOperation: form.citiesOfOperation.trim(),
                interestedIn: form.interestedIn,
                notes: form.notes.trim(),
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
                            Share your institution details and our team will arrange the right EDXS walkthrough for you.
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ py: { xs: 4, md: 5 } }}>
                        {reference ? (
                            <Alert icon={<CheckCircleOutline fontSize="inherit" />} severity="success" sx={{ mb: 3 }}>
                                Your demo request has been received. Reference: <strong>{reference}</strong>
                            </Alert>
                        ) : null}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 2.5 } }}>
                            <TextField label="Collected by (your name)" required placeholder="e.g. Ayesha, Info-XS team" value={form.collectedBy} onChange={update('collectedBy')} autoComplete="name" slotProps={{ htmlInput: { maxLength: 100 } }} sx={{ gridColumn: '1 / -1' }} />
                            <TextField label="School / Institution Name" required placeholder="e.g. Al-Kamran Public School" value={form.organisationName} onChange={update('organisationName')} autoComplete="organization" slotProps={{ htmlInput: { maxLength: 700 } }} sx={{ gridColumn: '1 / -1' }} />
                            <TextField label="Contact Person" required placeholder="Name & designation" value={form.contactPerson} onChange={update('contactPerson')} autoComplete="name" slotProps={{ htmlInput: { maxLength: 150 } }} sx={{ gridColumn: '1 / -1' }} />
                            <TextField label="Phone" required placeholder="03xx-xxxxxxx" value={form.phone} onChange={update('phone')} autoComplete="tel" slotProps={{ htmlInput: { maxLength: 25 } }} />
                            <TextField label="Email" type="email" placeholder="name@school.edu.pk" value={form.email} onChange={update('email')} autoComplete="email" slotProps={{ htmlInput: { maxLength: 100 } }} />
                            <TextField label="City" required placeholder="e.g. Karachi" value={form.city} onChange={update('city')} autoComplete="address-level2" slotProps={{ htmlInput: { maxLength: 100 } }} sx={{ gridColumn: '1 / -1' }} />

                            <Typography variant="h3" sx={{ gridColumn: '1 / -1', mt: 1, fontSize: '1.2rem', color: 'primary.dark' }}>
                                Optional details
                            </Typography>
                            <TextField label="Number of Campuses" type="number" placeholder="e.g. 3" value={form.numberOfCampuses} onChange={update('numberOfCampuses')} slotProps={{ htmlInput: { min: 1, max: 2147483647, step: 1 } }} />
                            <TextField label="Student Strength" type="number" placeholder="e.g. 1200" value={form.studentStrength} onChange={update('studentStrength')} slotProps={{ htmlInput: { min: 1, max: 2147483647, step: 1 } }} />
                            <TextField label="Cities of Operation (if multi-campus)" placeholder="e.g. Karachi, Hyderabad, Sukkur" value={form.citiesOfOperation} onChange={update('citiesOfOperation')} slotProps={{ htmlInput: { maxLength: 300 } }} sx={{ gridColumn: '1 / -1' }} />

                            <Box sx={{ gridColumn: '1 / -1' }}>
                                <Typography sx={{ mb: 1, fontWeight: 800, color: 'text.primary' }}>Interested In</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {interestOptions.map((interest) => {
                                        const selected = form.interestedIn.includes(interest);
                                        return (
                                            <Button
                                                key={interest}
                                                type="button"
                                                variant={selected ? 'contained' : 'outlined'}
                                                aria-pressed={selected}
                                                onClick={() => toggleInterest(interest)}
                                                sx={{ color: selected ? 'white' : 'primary.dark', borderColor: 'rgba(111,150,63,0.4)', px: 2, py: 0.9 }}
                                            >
                                                {interest}
                                            </Button>
                                        );
                                    })}
                                </Box>
                            </Box>
                            <TextField label="Notes" placeholder="Anything worth remembering for follow-up..." value={form.notes} onChange={update('notes')} multiline minRows={4} slotProps={{ htmlInput: { maxLength: 2000 } }} sx={{ gridColumn: '1 / -1' }} />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2, mt: 4, maxWidth: { md: 420 } }}>
                            <Button component={RouterLink} to="/" startIcon={<ArrowBack />} variant="outlined" sx={{ minHeight: 52, px: 1, color: 'primary.main', borderColor: 'rgba(111,150,63,0.45)', fontWeight: 800, fontSize: { xs: '0.82rem', sm: '0.9rem' }, whiteSpace: 'nowrap' }}>
                                Back to home
                            </Button>
                            <Button type="submit" variant="contained" disabled={submitting} sx={{ minWidth: 0, minHeight: 52, py: 1.35, px: 1, fontWeight: 800, fontSize: { xs: '0.82rem', sm: '0.9rem' }, whiteSpace: 'nowrap' }}>
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
