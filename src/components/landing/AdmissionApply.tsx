import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Button,
    TextField,
    MenuItem,
    Alert,
    AlertTitle,
    Divider,
    CircularProgress,
    ListSubheader,
    alpha
} from '@mui/material';
import {
    fetchAdmissionSchools,
    fetchAdmissionOptions,
    submitAdmissionEnquiry,
    fetchAdmissionStatus,
    type AdmissionSchool,
    type AdmissionOptions,
    type AdmissionStatus
} from '../../api/admission';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface FormState {
    fullName: string;
    email: string;
    phone: string;
    studentName: string;
    programOfInterest: string;
    gradeLevel: string;
    message: string;
}

const emptyForm: FormState = {
    fullName: '',
    email: '',
    phone: '',
    studentName: '',
    programOfInterest: '',
    gradeLevel: '',
    message: ''
};

/** Mirrors the server's rule so the visitor is told before a round trip. */
const isValidEmail = (value: string): boolean => {
    const trimmed = value.trim();
    return trimmed.includes('@') && trimmed.length > 2 && trimmed.length <= 50;
};

const AdmissionApply: React.FC = () => {
    const [schools, setSchools] = useState<AdmissionSchool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [schoolCode, setSchoolCode] = useState('');
    const [campusId, setCampusId] = useState<number | ''>('');
    const [registerId, setRegisterId] = useState<number | ''>('');
    const [classId, setClassId] = useState<number | ''>('');
    const [options, setOptions] = useState<AdmissionOptions>({ registers: [], classes: [] });
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);
    const [optionsError, setOptionsError] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [reference, setReference] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);
    const [copied, setCopied] = useState(false);

    const [statusToken, setStatusToken] = useState('');
    const [statusResult, setStatusResult] = useState<AdmissionStatus | null>(null);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        fetchAdmissionSchools(controller.signal)
            .then((data) => {
                setSchools(data);
                setLoadError(null);
            })
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                setLoadError('We could not load the list of schools just now. Please try again shortly.');
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, []);

    // Registers and classes are campus-specific, so they are fetched once a
    // campus is chosen rather than loaded up front for every school.
    useEffect(() => {
        if (!schoolCode || campusId === '') {
            return;
        }

        const controller = new AbortController();
        setIsLoadingOptions(true);
        setOptionsError(null);

        fetchAdmissionOptions(schoolCode, campusId, controller.signal)
            .then((data) => setOptions(data))
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                setOptions({ registers: [], classes: [] });
                setOptionsError('We could not load the classes for that campus.');
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoadingOptions(false);
            });

        return () => controller.abort();
    }, [schoolCode, campusId]);

    const selected = useMemo(
        () => schools.find((school) => school.code === schoolCode) ?? null,
        [schools, schoolCode]
    );

    // Schools are grouped by city so a long list stays scannable; those without
    // a city fall into a trailing group rather than being dropped.
    const grouped = useMemo(() => {
        const groups = new Map<string, AdmissionSchool[]>();
        schools.forEach((school) => {
            const key = school.city.trim() || 'Other';
            const list = groups.get(key);
            if (list) {
                list.push(school);
            } else {
                groups.set(key, [school]);
            }
        });
        return Array.from(groups.entries()).sort(([a], [b]) => {
            if (a === 'Other') return 1;
            if (b === 'Other') return -1;
            return a.localeCompare(b);
        });
    }, [schools]);

    const handleSchoolChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSchoolCode(event.target.value);
        // Everything below the school depends on it, so the cascade resets.
        setCampusId('');
        setRegisterId('');
        setClassId('');
        setOptions({ registers: [], classes: [] });
        setSubmitError(null);
        setReference(null);
    }, []);

    const handleCampusChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCampusId(value === '' ? '' : Number(value));
        setRegisterId('');
        setClassId('');
        setOptions({ registers: [], classes: [] });
        setSubmitError(null);
    }, []);

    const updateField = useCallback(
        (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setForm((current) => ({ ...current, [key]: value }));
        },
        []
    );

    const canSubmit =
        selected !== null &&
        selected.acceptsEnquiries &&
        campusId !== '' &&
        classId !== '' &&
        form.fullName.trim().length > 0 &&
        isValidEmail(form.email) &&
        !isSubmitting;

    const handleSubmit = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();
            if (!selected || !canSubmit) return;

            setIsSubmitting(true);
            setSubmitError(null);
            try {
                const result = await submitAdmissionEnquiry(selected.code, {
                    fullName: form.fullName.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || undefined,
                    studentName: form.studentName.trim() || undefined,
                    programOfInterest: form.programOfInterest.trim() || undefined,
                    gradeLevel: form.gradeLevel.trim() || undefined,
                    campusId,
                    registerId: registerId === '' ? undefined : registerId,
                    classId,
                    message: form.message.trim() || undefined
                });
                setReference(result.token);
                setEmailSent(result.emailSent);
                setStatusToken(result.token);
            } catch (err: unknown) {
                setSubmitError(
                    err instanceof Error
                        ? err.message
                        : 'We could not record your enquiry just now. Please try again.'
                );
            } finally {
                setIsSubmitting(false);
            }
        },
        [selected, canSubmit, form, campusId, registerId, classId]
    );

    const handleCheckStatus = useCallback(async () => {
        if (!selected || !statusToken.trim()) return;
        setIsCheckingStatus(true);
        setStatusError(null);
        setStatusResult(null);
        try {
            const result = await fetchAdmissionStatus(selected.code, statusToken.trim());
            if (result) {
                setStatusResult(result);
            } else {
                setStatusError('We could not find an application with that reference.');
            }
        } catch (err: unknown) {
            setStatusError(
                err instanceof Error ? err.message : 'We could not check that reference just now.'
            );
        } finally {
            setIsCheckingStatus(false);
        }
    }, [selected, statusToken]);

    const copyReference = useCallback(() => {
        if (!reference) return;
        navigator.clipboard?.writeText(reference).then(
            () => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
            },
            () => setCopied(false)
        );
    }, [reference]);

    return (
        <Box id="admission-apply" sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 900, mb: 2, color: 'text.primary', textTransform: 'uppercase' }}
                >
                    Apply for Admission
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 4, maxWidth: 760 }}>
                    Choose the school and campus you would like to apply to, then tell us about the student.
                    Your enquiry goes straight to that school's admissions team.
                </Typography>

                {loadError && (
                    <Alert severity="warning" sx={{ mb: 4 }}>
                        {loadError}
                    </Alert>
                )}

                <Box
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: alpha('#76a345', 0.15)
                    }}
                >
                    {/* ---------- School & campus pickers ---------- */}
                    <Grid container spacing={3} sx={{ mb: 1 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                required
                                label="School"
                                value={schoolCode}
                                onChange={handleSchoolChange}
                                disabled={isLoading || schools.length === 0}
                                helperText={
                                    isLoading
                                        ? 'Loading schools…'
                                        : schools.length === 0
                                          ? 'No schools are available right now.'
                                          : `${schools.length} schools accepting enquiries`
                                }
                            >
                                {grouped.flatMap(([city, list]) => [
                                    <ListSubheader key={`h-${city}`} sx={{ fontWeight: 800, color: 'primary.main' }}>
                                        {city}
                                    </ListSubheader>,
                                    ...list.map((school) => (
                                        <MenuItem
                                            key={school.code}
                                            value={school.code}
                                            disabled={!school.acceptsEnquiries}
                                        >
                                            {school.name}
                                            {!school.acceptsEnquiries && ' — not accepting online enquiries'}
                                        </MenuItem>
                                    ))
                                ])}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                required
                                label="Campus"
                                value={campusId}
                                onChange={handleCampusChange}
                                disabled={!selected || selected.campuses.length === 0}
                                helperText={
                                    !selected
                                        ? 'Choose a school first'
                                        : selected.campuses.length === 0
                                          ? 'No campuses listed for this school'
                                          : ' '
                                }
                            >
                                {selected?.campuses.map((entry) => (
                                    <MenuItem key={entry.id} value={entry.id}>
                                        {entry.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Academic year / register"
                                value={registerId}
                                onChange={(event) =>
                                    setRegisterId(event.target.value === '' ? '' : Number(event.target.value))
                                }
                                disabled={campusId === '' || isLoadingOptions || options.registers.length === 0}
                                helperText={
                                    campusId === ''
                                        ? 'Choose a campus first'
                                        : isLoadingOptions
                                          ? 'Loading…'
                                          : options.registers.length === 0
                                            ? 'No registers open at this campus'
                                            : 'Optional'
                                }
                            >
                                <MenuItem value="">No preference</MenuItem>
                                {options.registers.map((register) => (
                                    <MenuItem key={register.id} value={register.id}>
                                        {register.academicYear
                                            ? `${register.academicYear} — ${register.name}`
                                            : register.name}
                                        {register.isActive && ' (current)'}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                required
                                label="Class applying for"
                                value={classId}
                                onChange={(event) =>
                                    setClassId(event.target.value === '' ? '' : Number(event.target.value))
                                }
                                disabled={campusId === '' || isLoadingOptions || options.classes.length === 0}
                                error={optionsError !== null}
                                helperText={
                                    optionsError
                                        ? optionsError
                                        : campusId === ''
                                          ? 'Choose a campus first'
                                          : isLoadingOptions
                                            ? 'Loading…'
                                            : options.classes.length === 0
                                              ? 'No classes listed for this campus'
                                              : 'Required'
                                }
                            >
                                {options.classes.map((entry) => (
                                    <MenuItem key={entry.id} value={entry.id}>
                                        {entry.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    {selected && !selected.acceptsEnquiries && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            {selected.name} is not accepting online enquiries at the moment. Please choose
                            another school or contact them directly.
                        </Alert>
                    )}

                    {selected?.acceptsEnquiries && classId !== '' && (
                        <>
                            <Divider sx={{ my: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                                    <SchoolIcon />
                                    <Typography sx={{ fontWeight: 800 }}>{selected.name}</Typography>
                                </Box>
                            </Divider>

                            {/* ---------- Success state ---------- */}
                            {reference ? (
                                <Box>
                                    <Alert severity="success" sx={{ mb: 3 }}>
                                        <AlertTitle sx={{ fontWeight: 800 }}>Enquiry received</AlertTitle>
                                        {emailSent
                                            ? 'A confirmation has been sent to your email address.'
                                            : 'Your enquiry was recorded. Please keep your reference safe.'}
                                    </Alert>

                                    <Box
                                        sx={{
                                            p: 3,
                                            mb: 4,
                                            borderRadius: 3,
                                            bgcolor: 'secondary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: 2,
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 800 }}>
                                                YOUR REFERENCE
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                sx={{ fontWeight: 900, color: 'primary.dark', letterSpacing: 1 }}
                                            >
                                                {reference}
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            startIcon={<ContentCopyIcon />}
                                            onClick={copyReference}
                                            sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}
                                        >
                                            {copied ? 'Copied' : 'Copy'}
                                        </Button>
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setReference(null);
                                            setForm(emptyForm);
                                        }}
                                        sx={{ color: 'primary.main', borderColor: 'primary.main', fontWeight: 700 }}
                                    >
                                        Submit another enquiry
                                    </Button>
                                </Box>
                            ) : (
                                /* ---------- Form ---------- */
                                <Box component="form" onSubmit={handleSubmit} noValidate>
                                    {submitError && (
                                        <Alert severity="error" sx={{ mb: 3 }}>
                                            {submitError}
                                        </Alert>
                                    )}

                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Your full name"
                                                value={form.fullName}
                                                onChange={updateField('fullName')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                required
                                                type="email"
                                                label="Email address"
                                                value={form.email}
                                                onChange={updateField('email')}
                                                error={form.email.length > 0 && !isValidEmail(form.email)}
                                                helperText={
                                                    form.email.length > 0 && !isValidEmail(form.email)
                                                        ? 'Enter a valid email address (max 50 characters).'
                                                        : ' '
                                                }
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Phone number"
                                                value={form.phone}
                                                onChange={updateField('phone')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Student's name"
                                                value={form.studentName}
                                                onChange={updateField('studentName')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Programme of interest"
                                                value={form.programOfInterest}
                                                onChange={updateField('programOfInterest')}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Grade / year group"
                                                value={form.gradeLevel}
                                                onChange={updateField('gradeLevel')}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                label="Anything else we should know?"
                                                value={form.message}
                                                onChange={updateField('message')}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={!canSubmit}
                                            endIcon={isSubmitting ? undefined : <SendIcon />}
                                            sx={{
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                px: 4,
                                                py: 1.5,
                                                fontWeight: 700
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <CircularProgress size={18} sx={{ color: 'white', mr: 1 }} />
                                                    Sending…
                                                </>
                                            ) : (
                                                'Submit Enquiry'
                                            )}
                                        </Button>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Name, email and class are required.
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {/* ---------- Status lookup ---------- */}
                            <Divider sx={{ my: 4 }} />

                            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>
                                Already applied?
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                                Enter your reference to see where your application has reached.
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                <TextField
                                    size="small"
                                    label="Your reference"
                                    value={statusToken}
                                    onChange={(event) => setStatusToken(event.target.value)}
                                    sx={{ minWidth: 240 }}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={handleCheckStatus}
                                    disabled={!statusToken.trim() || isCheckingStatus}
                                    sx={{
                                        color: 'primary.main',
                                        borderColor: 'primary.main',
                                        fontWeight: 700,
                                        height: 40
                                    }}
                                >
                                    {isCheckingStatus ? 'Checking…' : 'Check Status'}
                                </Button>
                            </Box>

                            {statusError && (
                                <Alert severity="info" sx={{ mt: 3 }}>
                                    {statusError}
                                </Alert>
                            )}

                            {statusResult && (
                                <Box
                                    sx={{
                                        mt: 3,
                                        p: 3,
                                        borderRadius: 3,
                                        bgcolor: alpha('#76a345', 0.05),
                                        border: '1px solid',
                                        borderColor: alpha('#76a345', 0.2)
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 900, color: 'text.primary', mb: 0.5 }}>
                                        {statusResult.studentName || statusResult.applicantName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                        {statusResult.currentStatus}
                                        {statusResult.submittedOn &&
                                            ` · Submitted ${new Date(statusResult.submittedOn).toLocaleDateString()}`}
                                    </Typography>

                                    {statusResult.steps.map((step) => (
                                        <Box
                                            key={step.title}
                                            sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}
                                        >
                                            {step.state === 'done' ? (
                                                <CheckCircleIcon sx={{ color: 'primary.main', fontSize: '1.3rem' }} />
                                            ) : (
                                                <RadioButtonUncheckedIcon
                                                    sx={{
                                                        color: step.state === 'current' ? 'primary.main' : 'text.disabled',
                                                        fontSize: '1.3rem'
                                                    }}
                                                />
                                            )}
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: step.state === 'current' ? 800 : 600,
                                                        color:
                                                            step.state === 'upcoming' ? 'text.secondary' : 'text.primary'
                                                    }}
                                                >
                                                    {step.title}
                                                </Typography>
                                                {step.description && (
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        {step.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default AdmissionApply;
