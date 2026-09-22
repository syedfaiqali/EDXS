import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
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
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import {
    fetchAdmissionBoard,
    fetchProgramDetail,
    submitAdmissionEnquiry,
    emptyAdmissionBoard,
    schoolLogoUrl,
    type AdmissionBoard,
    type AdmissionPeriod,
    type AdmissionProgram,
    type AdmissionProgramDetail,
    type AdmissionRegister
} from '../../api/admission';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';

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

const closingLabel = (register: AdmissionRegister): string => formatDate(register.endDate);

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

/**
 * One programme in the Programs dialog. Its syllabus and timetable are fetched
 * the first time it is expanded, so opening the dialog does not pull a timetable
 * for every programme at once — a single school class can run to a thousand
 * periods.
 */
const ProgramRow: React.FC<{
    registerId: number;
    program: AdmissionProgram;
}> = ({ registerId, program }) => {
    const [detail, setDetail] = useState<AdmissionProgramDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [failed, setFailed] = useState(false);

    const loadDetail = useCallback(() => {
        if (detail || isLoading) return;
        setIsLoading(true);
        fetchProgramDetail(registerId, program.id)
            .then((data) => {
                setDetail(data);
                setFailed(false);
            })
            .catch(() => setFailed(true))
            .finally(() => setIsLoading(false));
    }, [detail, isLoading, registerId, program.id]);

    // Periods read best grouped by day, in week order.
    const byDay = useMemo<[string, AdmissionPeriod[]][]>(() => {
        if (!detail) return [];
        const days = new Map<string, AdmissionPeriod[]>();
        detail.periods.forEach((period) => {
            const list = days.get(period.day);
            if (list) {
                list.push(period);
            } else {
                days.set(period.day, [period]);
            }
        });
        return Array.from(days.entries()).sort(
            ([, a], [, b]) => a[0].dayOrder - b[0].dayOrder
        );
    }, [detail]);

    return (
        <Accordion
            disableGutters
            elevation={0}
            onChange={(_, expanded) => expanded && loadDetail()}
            sx={{
                borderRadius: 2,
                bgcolor: alpha('#76a345', 0.05),
                border: '1px solid',
                borderColor: alpha('#76a345', 0.15),
                '&:before': { display: 'none' }
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        width: '100%',
                        pr: 1
                    }}
                >
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {program.name}
                    </Typography>
                    {program.seats != null && (
                        <Chip
                            label={`${program.seats} seats`}
                            size="small"
                            sx={{
                                bgcolor: 'secondary.main',
                                color: 'primary.dark',
                                fontWeight: 700,
                                flexShrink: 0
                            }}
                        />
                    )}
                </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
                {isLoading && <Skeleton variant="rounded" height={90} />}

                {failed && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        We could not load the details for this programme.
                    </Typography>
                )}

                {detail && !isLoading && (
                    <>
                        {detail.subjects.length > 0 && (
                            <Box sx={{ mb: detail.periods.length > 0 ? 2.5 : 0 }}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 0.8 }}
                                >
                                    {detail.subjects.length === 1
                                        ? '1 COURSE'
                                        : `${detail.subjects.length} COURSES`}
                                </Typography>
                                <Box sx={{ mt: 0.75, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                    {detail.subjects.map((subject) => (
                                        <Chip
                                            key={subject}
                                            label={subject}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                borderColor: alpha('#76a345', 0.35),
                                                color: 'text.secondary',
                                                bgcolor: 'background.paper'
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {detail.teachers.length > 0 && (
                            <Box sx={{ mb: 2.5 }}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 0.8 }}
                                >
                                    {detail.teachers.length === 1 ? 'TEACHER' : 'TEACHERS'}
                                </Typography>
                                <Box sx={{ mt: 0.75, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                    {detail.teachers.map((teacher) => (
                                        <Chip
                                            key={teacher}
                                            icon={<PersonOutlineIcon sx={{ fontSize: '0.95rem' }} />}
                                            label={teacher}
                                            size="small"
                                            sx={{
                                                bgcolor: 'background.paper',
                                                border: '1px solid',
                                                borderColor: alpha('#76a345', 0.25),
                                                color: 'text.primary',
                                                fontWeight: 600
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {byDay.length > 0 && (
                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 0.8 }}
                                >
                                    WEEKLY TIMETABLE
                                </Typography>
                                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {byDay.map(([day, periods]) => (
                                        <Box key={day}>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 800, color: 'primary.dark', mb: 0.5 }}
                                            >
                                                {day}
                                            </Typography>
                                            {periods.map((period, index) => (
                                                <Box
                                                    key={`${day}-${index}`}
                                                    sx={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        alignItems: 'baseline',
                                                        gap: 1,
                                                        py: 0.4,
                                                        pl: 1,
                                                        borderLeft: '2px solid',
                                                        borderColor: alpha('#76a345', 0.3)
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            color: 'text.secondary',
                                                            minWidth: 150
                                                        }}
                                                    >
                                                        <ScheduleIcon sx={{ fontSize: '0.9rem' }} />
                                                        <Typography variant="body2">
                                                            {period.startTime} – {period.endTime}
                                                        </Typography>
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 600, color: 'text.primary' }}
                                                    >
                                                        {period.subject || 'Scheduled period'}
                                                    </Typography>
                                                    {period.teacher && (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: 'text.secondary' }}
                                                        >
                                                            · {period.teacher}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {detail.subjects.length === 0 && detail.periods.length === 0 && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                The school has not published a syllabus for this programme yet.
                            </Typography>
                        )}
                    </>
                )}
            </AccordionDetails>
        </Accordion>
    );
};

const RegisterCard: React.FC<{
    register: AdmissionRegister;
    index: number;
    onApply: (register: AdmissionRegister) => void;
    onViewPrograms: (register: AdmissionRegister) => void;
}> = ({ register, index, onApply, onViewPrograms }) => {
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
                        onClick={() => onViewPrograms(register)}
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
    const [board, setBoard] = useState<AdmissionBoard>(emptyAdmissionBoard);
    const [facets, setFacets] = useState<AdmissionBoard>(emptyAdmissionBoard);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [search, setSearch] = useState('');
    const [schoolCode, setSchoolCode] = useState('');
    const [city, setCity] = useState('');
    const debouncedSearch = useDebouncedValue(search);

    const [selected, setSelected] = useState<AdmissionRegister | null>(null);
    const [programsFor, setProgramsFor] = useState<AdmissionRegister | null>(null);
    const [programId, setProgramId] = useState<number | ''>('');
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [reference, setReference] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);
    const [copied, setCopied] = useState(false);


    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);

        fetchAdmissionBoard({ search: debouncedSearch, schoolCode, city }, controller.signal)
            .then((data) => {
                setBoard(data);
                // Facets describe the whole board, so they are kept from the
                // first successful load rather than narrowing with the filters.
                setFacets((current) => (current.schools.length === 0 ? data : current));
                setLoadError(null);
            })
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                setBoard(emptyAdmissionBoard);
                setLoadError('We could not load open admissions just now. Please try again shortly.');
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, [debouncedSearch, schoolCode, city]);

    const openApply = useCallback((register: AdmissionRegister) => {
        setSelected(register);
        // A single programme needs no choosing.
        setProgramId(register.programs.length === 1 ? register.programs[0].id : '');
        setForm(emptyForm);
        setSubmitError(null);
        setReference(null);
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

    const hasFilters = search.trim() !== '' || schoolCode !== '' || city !== '';

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
                                {facets.schools.map((school) => (
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
                                {facets.cities.map((entry) => (
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
                                    : `${board.total} ${board.total === 1 ? 'intake' : 'intakes'} open`}
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

                {!isLoading && !loadError && board.registers.length === 0 && (
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

                {!isLoading && board.registers.length > 0 && (
                    <Grid container spacing={2.5}>
                        {board.registers.map((register, index) => (
                            <RegisterCard
                                key={register.id}
                                register={register}
                                index={index}
                                onApply={openApply}
                                onViewPrograms={setProgramsFor}
                            />
                        ))}
                    </Grid>
                )}

            </Container>

            {/* ---------- Programmes dialog ---------- */}
            <Dialog
                open={programsFor !== null}
                onClose={() => setProgramsFor(null)}
                maxWidth="sm"
                fullWidth
                scroll="paper"
            >
                {programsFor && (
                    <>
                        <DialogTitle sx={{ pr: 7 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <SchoolLogo
                                    code={programsFor.schoolCode}
                                    hasLogo={programsFor.hasLogo}
                                    size={44}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>
                                    {programsFor.schoolName}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                {programsFor.campusName}
                                {programsFor.academicSession && ` · ${programsFor.academicSession}`}
                            </Typography>
                            <IconButton
                                onClick={() => setProgramsFor(null)}
                                sx={{ position: 'absolute', right: 12, top: 12 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent dividers>
                            <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 1 }}
                            >
                                {programsFor.programs.length === 1
                                    ? '1 PROGRAMME OPEN'
                                    : `${programsFor.programs.length} PROGRAMMES OPEN`}
                            </Typography>

                            <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {programsFor.programs.map((program) => (
                                    <ProgramRow
                                        key={program.id}
                                        registerId={programsFor.id}
                                        program={program}
                                    />
                                ))}
                            </Box>

                            {closingLabel(programsFor) && (
                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3 }}>
                                    Applications close {closingLabel(programsFor)}.
                                </Typography>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ px: 3, py: 2 }}>
                            <Button onClick={() => setProgramsFor(null)} sx={{ color: 'text.secondary' }}>
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    const register = programsFor;
                                    setProgramsFor(null);
                                    openApply(register);
                                }}
                                sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}
                            >
                                Apply
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

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
