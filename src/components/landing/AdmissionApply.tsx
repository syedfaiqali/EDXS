import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Button,
    TextField,
    MenuItem,
    InputAdornment,
    Chip,
    Skeleton,
    Alert,
    AlertTitle,
    Divider,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    alpha
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import {
    submitAdmissionEnquiry,
    emptyAdmissionBoard,
    schoolLogoUrl,
    type AdmissionRegister
} from '../../api/admission';
import { loadBoard, boardCacheKey } from '../../store/admissionSlice';
import type { AppDispatch, RootState } from '../../store';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchOffIcon from '@mui/icons-material/SearchOff';

interface FormState {
    fullName: string;
    email: string;
    phone: string;
    studentName: string;
    message: string;
}

const emptyForm: FormState = {
    fullName: '',
    email: '',
    phone: '',
    studentName: '',
    message: ''
};

/** Mirrors the server's rule so the visitor is told before a round trip. */
const isValidEmail = (value: string): boolean => {
    const trimmed = value.trim();
    return trimmed.includes('@') && trimmed.length > 2 && trimmed.length <= 50;
};

const formatDate = (iso: string | null): string => {
    if (!iso) return '';
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
};

/**
 * A school's logo, falling back to a generic mark when the school has none or
 * the image fails to load. Sized to a fixed box so cards line up regardless of
 * the logo's own aspect ratio.
 */
const SchoolLogo: React.FC<{ code: string; hasLogo: boolean; size: number }> = ({
    code,
    hasLogo,
    size
}) => {
    const [failed, setFailed] = useState(false);
    const showImage = hasLogo && !failed;

    return (
        <Box
            sx={{
                width: size,
                height: size,
                flexShrink: 0,
                borderRadius: 2,
                bgcolor: showImage ? 'background.paper' : alpha('#76a345', 0.08),
                border: '1px solid',
                borderColor: alpha('#76a345', 0.15),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            {showImage ? (
                <Box
                    component="img"
                    src={schoolLogoUrl(code)}
                    alt=""
                    loading="lazy"
                    onError={() => setFailed(true)}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 0.5 }}
                />
            ) : (
                <SchoolIcon sx={{ color: 'primary.main', fontSize: size * 0.55 }} />
            )}
        </Box>
    );
};

const RegisterCard: React.FC<{
    register: AdmissionRegister;
    index: number;
    onApply: (register: AdmissionRegister) => void;
}> = ({ register, index, onApply }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 });
    const closes = formatDate(register.endDate);
    const delay = Math.min(index, 8) * 0.06;

    return (
        <Grid size={12}>
            <Box
                ref={cardRef}
                sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: alpha('#76a345', 0.15),
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' },
                    gap: { xs: 2, md: 3 },
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 0.45s ease ${delay}s, transform 0.45s ease ${delay}s, box-shadow 0.3s ease`,
                    '&:hover': { boxShadow: '0 12px 28px rgba(118,163,69,0.14)' }
                }}
            >
                <SchoolLogo code={register.schoolCode} hasLogo={register.hasLogo} size={52} />

                {/* Identity and location */}
                <Box sx={{ minWidth: 0, flex: { md: '0 0 26%' } }}>
                    <Typography sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1.3 }}>
                        {register.schoolName}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            columnGap: 1.5,
                            mt: 0.5,
                            color: 'text.secondary'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                            <ApartmentIcon sx={{ fontSize: '0.95rem', flexShrink: 0 }} />
                            <Typography variant="body2" noWrap>
                                {register.campusName}
                            </Typography>
                        </Box>
                        {register.city && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOnIcon sx={{ fontSize: '0.95rem' }} />
                                <Typography variant="body2">{register.city}</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Session and deadline */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: { md: '0 0 auto' } }}>
                    {register.academicSession && (
                        <Chip
                            label={register.academicSession}
                            size="small"
                            sx={{ bgcolor: 'secondary.main', color: 'primary.dark', fontWeight: 800 }}
                        />
                    )}
                    {closes && (
                        <Chip
                            icon={<EventIcon sx={{ fontSize: '1rem' }} />}
                            label={`Closes ${closes}`}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: alpha('#76a345', 0.4), color: 'text.secondary' }}
                        />
                    )}
                </Box>

                {/* Programmes, taking the slack in the row */}
                {register.programs.length > 0 && (
                    <Box sx={{ minWidth: 0, flex: { md: 1 } }}>
                        <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 1 }}
                        >
                            {register.programs.length === 1
                                ? '1 PROGRAMME OPEN'
                                : `${register.programs.length} PROGRAMMES OPEN`}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                lineHeight: 1.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}
                        >
                            {register.programs
                                .slice(0, 3)
                                .map((program) => program.name)
                                .join(' · ')}
                            {register.programs.length > 3 && ` · +${register.programs.length - 3} more`}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ flexShrink: 0, ml: { md: 'auto' }, display: 'flex', gap: 1.5 }}>
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        to={`/admission/intake/${register.id}`}
                        disabled={register.programs.length === 0}
                        sx={{
                            color: 'primary.main',
                            borderColor: 'primary.main',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            '&:hover': { borderColor: 'primary.dark', bgcolor: alpha('#76a345', 0.08) }
                        }}
                    >
                        Programs
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => onApply(register)}
                        disabled={register.programs.length === 0}
                        sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700, whiteSpace: 'nowrap' }}
                    >
                        {register.programs.length === 0 ? 'Not open' : 'Apply'}
                    </Button>
                </Box>
            </Box>
        </Grid>
    );
};

const AdmissionApply: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [schoolCode, setSchoolCode] = useState('');
    const [city, setCity] = useState('');
    const [loadError, setLoadError] = useState<string | null>(null);
    const debouncedSearch = useDebouncedValue(search);

    const filters = useMemo(
        () => ({ search: debouncedSearch, schoolCode, city }),
        [debouncedSearch, schoolCode, city]
    );
    const cacheKey = boardCacheKey(filters);

    // Reading straight from the cache means a filter combination already seen
    // renders immediately, with no request and no loading flash.
    const board = useSelector((state: RootState) => state.admission.boards[cacheKey]);
    const facets = useSelector((state: RootState) => state.admission.facets);
    const isLoading = useSelector(
        (state: RootState) =>
            state.admission.boards[cacheKey] === undefined &&
            state.admission.pending.includes(`board:${cacheKey}`)
    );

    // A cache miss renders as an empty board rather than null-checking in JSX.
    const view = board ?? emptyAdmissionBoard;
    const hasFilters = search.trim() !== '' || schoolCode !== '' || city !== '';

    const [selected, setSelected] = useState<AdmissionRegister | null>(null);
    const [programId, setProgramId] = useState<number | ''>('');
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [reference, setReference] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);
    const [copied, setCopied] = useState(false);


    useEffect(() => {
        // The thunk skips the request when this combination is already cached or
        // in flight, so this can fire freely as filters change.
        dispatch(loadBoard(filters))
            .unwrap()
            .then(() => setLoadError(null))
            .catch((err: unknown) => {
                // A skipped request reports as a condition error, which is not a
                // failure the visitor should see.
                if (err && typeof err === 'object' && 'name' in err && err.name === 'ConditionError') {
                    return;
                }
                setLoadError('We could not load open admissions just now. Please try again shortly.');
            });
    }, [dispatch, filters]);

    const openApply = useCallback((register: AdmissionRegister) => {
        setSelected(register);
        // A single programme needs no choosing.
        setProgramId(register.programs.length === 1 ? register.programs[0].id : '');
        setForm(emptyForm);
        setSubmitError(null);
        setReference(null);
    }, []);

    // Arriving from an intake page with "apply for this one": open that intake's
    // form directly, rather than making the visitor find it on the board again.
    //
    // The request is consumed once and wiped from history, so closing the dialog
    // cannot re-trigger it — without that, the effect would reopen the form the
    // moment `selected` cleared.
    const requested = location.state as
        | { applyRegisterId?: number; applyProgramId?: number }
        | null;
    const handledRequest = useRef<number | null>(null);

    useEffect(() => {
        const wanted = requested?.applyRegisterId;
        if (!wanted || handledRequest.current === wanted) return;

        const match = view.registers.find((register) => register.id === wanted);
        if (!match) {
            // A filter left over from an earlier visit can hide the intake, so
            // the filters are cleared and the lookup retried on the next render.
            if (!isLoading && hasFilters) {
                setSearch('');
                setSchoolCode('');
                setCity('');
            }
            return;
        }

        handledRequest.current = wanted;
        setSelected(match);
        setProgramId(
            requested?.applyProgramId ??
                (match.programs.length === 1 ? match.programs[0].id : '')
        );
        setForm(emptyForm);
        setSubmitError(null);
        setReference(null);

        document
            .getElementById('admission-apply')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Drop the intent so a refresh or back-navigation does not reopen it.
        navigate(location.pathname, { replace: true, state: null });
    }, [requested, view.registers, isLoading, hasFilters, navigate, location.pathname]);

    const updateField = useCallback(
        (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setForm((current) => ({ ...current, [key]: value }));
        },
        []
    );

    const canSubmit =
        selected !== null &&
        programId !== '' &&
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
                const result = await submitAdmissionEnquiry(selected.schoolCode, {
                    fullName: form.fullName.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || undefined,
                    studentName: form.studentName.trim() || undefined,
                    campusId: selected.campusId,
                    registerId: selected.id,
                    classId: programId,
                    message: form.message.trim() || undefined
                });
                setReference(result.token);
                setEmailSent(result.emailSent);
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
        [selected, canSubmit, form, programId]
    );

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
                    Open Admissions
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 4, maxWidth: 800 }}>
                    Admissions closing in the next three months across our schools and universities. Choose one
                    to see the classes or programmes it is accepting, then apply — your enquiry goes straight
                    to that school's admissions team.
                </Typography>

                {/* ---------- Filters ---------- */}
                <Box
                    sx={{
                        p: { xs: 3, md: 4 },
                        mb: 5,
                        borderRadius: 4,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: alpha('#76a345', 0.15)
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 5 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search school, campus or programme…"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="School"
                                value={schoolCode}
                                onChange={(event) => setSchoolCode(event.target.value)}
                            >
                                <MenuItem value="">All schools</MenuItem>
                                {(facets?.schools ?? []).map((school) => (
                                    <MenuItem key={school.code} value={school.code}>
                                        {school.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="City"
                                value={city}
                                onChange={(event) => setCity(event.target.value)}
                            >
                                <MenuItem value="">All cities</MenuItem>
                                {(facets?.cities ?? []).map((entry) => (
                                    <MenuItem key={entry} value={entry}>
                                        {entry}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 2 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {isLoading
                                    ? 'Loading…'
                                    : `${view.total} ${view.total === 1 ? 'intake' : 'intakes'} open`}
                            </Typography>
                        </Grid>
                    </Grid>

                    {hasFilters && (
                        <Button
                            size="small"
                            onClick={() => {
                                setSearch('');
                                setSchoolCode('');
                                setCity('');
                            }}
                            sx={{ color: 'primary.main', fontWeight: 700, mt: 2 }}
                        >
                            Clear filters
                        </Button>
                    )}
                </Box>

                {loadError && (
                    <Alert severity="warning" sx={{ mb: 4 }}>
                        {loadError}
                    </Alert>
                )}

                {isLoading && (
                    <Grid container spacing={2.5}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Grid size={12} key={index}>
                                <Skeleton variant="rounded" height={104} sx={{ borderRadius: 3 }} />
                            </Grid>
                        ))}
                    </Grid>
                )}

                {!isLoading && !loadError && view.registers.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <SearchOffIcon sx={{ fontSize: '4rem', color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                            No open admissions match these filters
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                            {hasFilters
                                ? 'Try widening your search, or clear the filters.'
                                : 'No admissions are closing in the next three months. Please check back soon.'}
                        </Typography>
                    </Box>
                )}

                {!isLoading && view.registers.length > 0 && (
                    <Grid container spacing={2.5}>
                        {view.registers.map((register, index) => (
                            <RegisterCard
                                key={register.id}
                                register={register}
                                index={index}
                                onApply={openApply}
                            />
                        ))}
                    </Grid>
                )}

            </Container>

            {/* ---------- Apply dialog ---------- */}
            <Dialog
                open={selected !== null}
                onClose={() => setSelected(null)}
                maxWidth="md"
                fullWidth
                scroll="paper"
            >
                {selected && (
                    <>
                        <DialogTitle sx={{ pr: 7 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <SchoolLogo
                                    code={selected.schoolCode}
                                    hasLogo={selected.hasLogo}
                                    size={44}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>
                                    {selected.schoolName}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                {selected.campusName}
                                {selected.academicSession && ` · ${selected.academicSession}`}
                            </Typography>
                            <IconButton
                                onClick={() => setSelected(null)}
                                sx={{ position: 'absolute', right: 12, top: 12 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent dividers>
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
                                            <Typography
                                                variant="caption"
                                                sx={{ color: 'primary.dark', fontWeight: 800 }}
                                            >
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
                                </Box>
                            ) : (
                                <Box component="form" id="admission-form" onSubmit={handleSubmit} noValidate>
                                    {submitError && (
                                        <Alert severity="error" sx={{ mb: 3 }}>
                                            {submitError}
                                        </Alert>
                                    )}

                                    <TextField
                                        select
                                        fullWidth
                                        required
                                        label="Class or programme"
                                        value={programId}
                                        onChange={(event) =>
                                            setProgramId(
                                                event.target.value === '' ? '' : Number(event.target.value)
                                            )
                                        }
                                        helperText="Choose what you are applying for"
                                        sx={{ mb: 3 }}
                                    >
                                        {selected.programs.map((program) => (
                                            <MenuItem key={program.id} value={program.id}>
                                                {program.name}
                                                {program.seats != null && ` — ${program.seats} seats`}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <Divider sx={{ mb: 3 }} />

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
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label="Anything else we should know?"
                                                value={form.message}
                                                onChange={updateField('message')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ px: 3, py: 2 }}>
                            <Button onClick={() => setSelected(null)} sx={{ color: 'text.secondary' }}>
                                {reference ? 'Close' : 'Cancel'}
                            </Button>
                            {!reference && (
                                <Button
                                    type="submit"
                                    form="admission-form"
                                    variant="contained"
                                    disabled={!canSubmit}
                                    endIcon={isSubmitting ? undefined : <SendIcon />}
                                    sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}
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
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default AdmissionApply;
