import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    LinearProgress,
    MenuItem,
    Paper,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    alpha
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SchoolIcon from '@mui/icons-material/School';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { fetchAdmissionStatus } from '../api/admission';
import { fetchCareerApplicationStatus } from '../api/careers';
import { loadSchools } from '../store/admissionSlice';
import type { AppDispatch, RootState } from '../store';

/** Which journey the visitor is looking up. */
type StatusKind = 'admission' | 'career';

/**
 * The two application types share a timeline, so both lookups are normalised
 * into this one shape and the page renders a single view.
 */
interface StatusView {
    token: string;
    /** Who applied. */
    applicantName: string;
    /** The student for an admission, the vacancy for a job application. */
    subjectLabel: string;
    subjectValue: string;
    submittedOn: string | null;
    currentStatus: string;
    steps: { title: string; description: string; state: string }[];
}

const isKind = (value: string | null): value is StatusKind =>
    value === 'admission' || value === 'career';

/**
 * One stage of the journey. Upcoming stages are deliberately kept legible
 * rather than greyed into invisibility: knowing what happens next is most of
 * why someone checks their status at all.
 */
const TimelineStep: React.FC<{
    step: StatusView['steps'][number];
    index: number;
    isLast: boolean;
}> = ({ step, index, isLast }) => {
    const isDone = step.state === 'done';
    const isCurrent = step.state === 'current';

    return (
        <Stack direction="row" spacing={{ xs: 2, md: 3 }}>
            <Stack alignItems="center" sx={{ flexShrink: 0 }}>
                {isDone ? (
                    <CheckCircleIcon sx={{ color: 'primary.main', fontSize: '1.9rem' }} />
                ) : isCurrent ? (
                    <RadioButtonCheckedIcon sx={{ color: 'primary.main', fontSize: '1.9rem' }} />
                ) : (
                    <RadioButtonUncheckedIcon sx={{ color: 'text.disabled', fontSize: '1.9rem' }} />
                )}
                {!isLast && (
                    <Box
                        sx={{
                            width: 3,
                            flexGrow: 1,
                            minHeight: { xs: 36, md: 48 },
                            my: 0.75,
                            borderRadius: 2,
                            bgcolor: isDone ? 'primary.main' : 'divider'
                        }}
                    />
                )}
            </Stack>

            <Box
                sx={{
                    pb: isLast ? 0 : { xs: 3, md: 4 },
                    flexGrow: 1,
                    // The live stage is lifted onto its own card so the eye lands
                    // on "where am I now" before reading the rest of the journey.
                    ...(isCurrent && {
                        p: { xs: 2, md: 2.5 },
                        mt: -1,
                        mb: 2,
                        borderRadius: 3,
                        bgcolor: alpha('#6f963f', 0.07),
                        border: '1px solid',
                        borderColor: alpha('#6f963f', 0.25)
                    })
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ mb: 0.5 }}
                >
                    <Typography
                        sx={{
                            fontWeight: isCurrent ? 900 : 800,
                            fontSize: { xs: '1.02rem', md: '1.1rem' },
                            color: step.state === 'upcoming' ? 'text.secondary' : 'text.primary'
                        }}
                    >
                        {`${index + 1}. ${step.title}`}
                    </Typography>
                    {isDone && (
                        <Chip
                            size="small"
                            label="Completed"
                            sx={{ fontWeight: 700, bgcolor: alpha('#6f963f', 0.12), color: 'primary.dark' }}
                        />
                    )}
                    {isCurrent && (
                        <Chip
                            size="small"
                            label="In progress"
                            sx={{ fontWeight: 700, bgcolor: 'primary.main', color: '#fff' }}
                        />
                    )}
                    {step.state === 'upcoming' && (
                        <Chip
                            size="small"
                            variant="outlined"
                            label="Up next"
                            sx={{ fontWeight: 700, color: 'text.secondary' }}
                        />
                    )}
                </Stack>
                {step.description && (
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', maxWidth: 640, lineHeight: 1.75 }}
                    >
                        {step.description}
                    </Typography>
                )}
            </Box>
        </Stack>
    );
};

/** A labelled fact from the application header. */
const SummaryItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <Box>
        <Typography
            sx={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', color: 'text.secondary' }}
        >
            {label.toUpperCase()}
        </Typography>
        <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 0.25 }}>{value}</Typography>
    </Box>
);

/**
 * The full-page application status lookup.
 *
 * It replaces the small dialog that used to live in the header: the journey has
 * four stages and the upcoming ones matter as much as the current one, which is
 * more than a modal can show without scrolling. Having a route also lets the
 * confirmation email link straight to a filled-in result.
 */
const CheckStatusPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();
    const schools = useSelector((state: RootState) => state.admission.schools) ?? [];

    const [kind, setKind] = useState<StatusKind>(() => {
        const requested = searchParams.get('kind');
        return isKind(requested) ? requested : 'admission';
    });
    const [schoolCode, setSchoolCode] = useState(() => searchParams.get('school') ?? '');
    const [token, setToken] = useState(() => searchParams.get('ref') ?? '');
    const [result, setResult] = useState<StatusView | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    // Both journeys are keyed by the organisation, so the same directory serves
    // the school list and the employer list.
    useEffect(() => {
        dispatch(loadSchools());
    }, [dispatch]);

    const lookUp = useCallback(
        async (lookupKind: StatusKind, code: string, reference: string) => {
            const trimmed = reference.trim();
            if (!code || !trimmed) return;

            setIsChecking(true);
            setError(null);
            setNotFound(false);
            setResult(null);
            try {
                if (lookupKind === 'admission') {
                    const status = await fetchAdmissionStatus(code, trimmed);
                    if (status) {
                        setResult({
                            token: status.token,
                            applicantName: status.applicantName,
                            subjectLabel: 'Student',
                            subjectValue: status.studentName,
                            submittedOn: status.submittedOn,
                            currentStatus: status.currentStatus,
                            steps: status.steps
                        });
                    } else {
                        setNotFound(true);
                    }
                } else {
                    const status = await fetchCareerApplicationStatus(code, trimmed);
                    if (status) {
                        setResult({
                            token: status.token,
                            applicantName: status.applicantName,
                            subjectLabel: 'Position',
                            subjectValue: status.positionTitle,
                            submittedOn: status.submittedOn,
                            currentStatus: status.currentStatus,
                            steps: status.steps
                        });
                    } else {
                        setNotFound(true);
                    }
                }
            } catch (err: unknown) {
                setError(
                    err instanceof Error ? err.message : 'We could not check that reference just now.'
                );
            } finally {
                setIsChecking(false);
            }
        },
        []
    );

    const handleCheck = useCallback(() => {
        if (!schoolCode || !token.trim()) return;
        // Keeping the lookup in the URL makes the result shareable and lets the
        // browser's back button behave the way a page is expected to.
        setSearchParams({ kind, school: schoolCode, ref: token.trim() }, { replace: true });
        void lookUp(kind, schoolCode, token);
    }, [kind, schoolCode, token, lookUp, setSearchParams]);

    // A link from the confirmation email arrives with everything filled in, so
    // the visitor sees their status without retyping the reference.
    useEffect(() => {
        const linkedKind = searchParams.get('kind');
        const linkedSchool = searchParams.get('school');
        const linkedRef = searchParams.get('ref');
        if (linkedSchool && linkedRef) {
            void lookUp(isKind(linkedKind) ? linkedKind : 'admission', linkedSchool, linkedRef);
        }
        // Deep links are read once, on arrival; later lookups go through the form.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleKindChange = useCallback((_event: React.SyntheticEvent, value: StatusKind) => {
        setKind(value);
        // A reference belongs to one journey, so carrying a result across the
        // tabs would show the wrong thing under the wrong heading.
        setResult(null);
        setNotFound(false);
        setError(null);
    }, []);

    const completedCount = useMemo(
        () => result?.steps.filter((step) => step.state === 'done').length ?? 0,
        [result]
    );
    const progress = result?.steps.length
        ? ((completedCount + (result.steps.some((s) => s.state === 'current') ? 0.5 : 0)) /
              result.steps.length) *
          100
        : 0;

    const organisationLabel = kind === 'admission' ? 'School' : 'Employer';
    const canCheck = Boolean(schoolCode) && token.trim().length > 0 && !isChecking;

    return (
        <Box sx={{ pt: { xs: 12, md: 16 }, pb: { xs: 8, md: 12 }, minHeight: '100vh' }}>
            <Container maxWidth="md">
                <Stack spacing={1} sx={{ mb: { xs: 4, md: 5 } }}>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            letterSpacing: '0.12em',
                            fontSize: '0.78rem',
                            color: 'primary.dark'
                        }}
                    >
                        APPLICATION TRACKING
                    </Typography>
                    <Typography variant="h1" sx={{ fontSize: { xs: '2.1rem', md: '2.75rem' } }}>
                        Check your application status
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', maxWidth: 620 }}>
                        Enter the reference you were given when you applied to see how far your
                        application has come — and what happens next.
                    </Typography>
                </Stack>

                <Paper
                    elevation={0}
                    sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
                >
                    <Tabs
                        value={kind}
                        onChange={handleKindChange}
                        variant="fullWidth"
                        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                    >
                        <Tab
                            value="admission"
                            icon={<SchoolIcon />}
                            iconPosition="start"
                            label="Admission"
                            sx={{ fontWeight: 800, textTransform: 'none', minHeight: 64 }}
                        />
                        <Tab
                            value="career"
                            icon={<WorkOutlineIcon />}
                            iconPosition="start"
                            label="Career"
                            sx={{ fontWeight: 800, textTransform: 'none', minHeight: 64 }}
                        />
                    </Tabs>

                    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                        <Box
                            component="form"
                            onSubmit={(event: React.FormEvent) => {
                                event.preventDefault();
                                handleCheck();
                            }}
                        >
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
                                <TextField
                                    select
                                    fullWidth
                                    label={organisationLabel}
                                    value={schoolCode}
                                    onChange={(event) => setSchoolCode(event.target.value)}
                                    helperText={
                                        schools.length === 0
                                            ? `Loading ${organisationLabel.toLowerCase()} list…`
                                            : ' '
                                    }
                                    sx={{ flex: 1 }}
                                >
                                    {schools.map((school) => (
                                        <MenuItem key={school.code} value={school.code}>
                                            {school.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    fullWidth
                                    label="Your reference"
                                    placeholder="e.g. LAKH0000012"
                                    value={token}
                                    onChange={(event) => setToken(event.target.value)}
                                    helperText=" "
                                    sx={{ flex: 1 }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={!canCheck}
                                    sx={{ px: 4, py: 1.25, flexShrink: 0, width: { xs: '100%', md: 'auto' } }}
                                >
                                    {isChecking ? 'Checking…' : 'Check Status'}
                                </Button>
                            </Stack>
                        </Box>

                        {isChecking && (
                            <Stack alignItems="center" sx={{ py: 6 }}>
                                <CircularProgress />
                            </Stack>
                        )}

                        {error && !isChecking && (
                            <Alert severity="warning" sx={{ mt: 2, borderRadius: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {notFound && !isChecking && (
                            <Alert severity="info" sx={{ mt: 2, borderRadius: 3 }}>
                                {kind === 'admission'
                                    ? 'We could not find an application with that reference. Please check it and try again.'
                                    : 'We could not find a job application with that reference. Applications made on the job portal are tracked there — please check the email you received when you applied.'}
                            </Alert>
                        )}

                        {result && !isChecking && (
                            <Box sx={{ mt: 4 }}>
                                <Divider sx={{ mb: 4 }} />

                                <Stack
                                    direction="row"
                                    flexWrap="wrap"
                                    useFlexGap
                                    spacing={{ xs: 3, md: 5 }}
                                    sx={{ mb: 3 }}
                                >
                                    <SummaryItem label="Reference" value={result.token} />
                                    {result.applicantName && (
                                        <SummaryItem label="Applicant" value={result.applicantName} />
                                    )}
                                    {result.subjectValue && (
                                        <SummaryItem
                                            label={result.subjectLabel}
                                            value={result.subjectValue}
                                        />
                                    )}
                                    {result.submittedOn && (
                                        <SummaryItem
                                            label="Submitted"
                                            value={new Date(result.submittedOn).toLocaleDateString()}
                                        />
                                    )}
                                </Stack>

                                <Box
                                    sx={{
                                        p: { xs: 2.5, md: 3 },
                                        mb: 4,
                                        borderRadius: 3,
                                        bgcolor: alpha('#6f963f', 0.07),
                                        border: '1px solid',
                                        borderColor: alpha('#6f963f', 0.2)
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.72rem',
                                            fontWeight: 800,
                                            letterSpacing: '0.08em',
                                            color: 'primary.dark'
                                        }}
                                    >
                                        CURRENT STATUS
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 900,
                                            fontSize: { xs: '1.2rem', md: '1.4rem' },
                                            color: 'primary.dark',
                                            mb: 1.5
                                        }}
                                    >
                                        {result.currentStatus}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progress}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: alpha('#6f963f', 0.15),
                                            '& .MuiLinearProgress-bar': { borderRadius: 4 }
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{ mt: 1, color: 'text.secondary', fontWeight: 600 }}
                                    >
                                        {`${completedCount} of ${result.steps.length} stages completed`}
                                    </Typography>
                                </Box>

                                <Typography variant="h3" sx={{ mb: 3 }}>
                                    Your journey
                                </Typography>

                                <Stack spacing={0}>
                                    {result.steps.map((step, index) => (
                                        <TimelineStep
                                            key={step.title}
                                            step={step}
                                            index={index}
                                            isLast={index === result.steps.length - 1}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default CheckStatusPage;
