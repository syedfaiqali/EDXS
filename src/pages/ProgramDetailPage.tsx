import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Grid,
    Button,
    TextField,
    MenuItem,
    Chip,
    Skeleton,
    Alert,
    Breadcrumbs,
    Link,
    Tab,
    Tabs,
    alpha
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    schoolLogoUrl,
    type AdmissionPeriod,
    type AdmissionSubject
} from '../api/admission';
import {
    loadRegister,
    loadProgramDetail,
    selectRegister,
    selectProgramDetail
} from '../store/admissionSlice';
import type { AppDispatch, RootState } from '../store';
import SchoolIcon from '@mui/icons-material/School';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

/** Columns are fixed so an empty day still holds its place in the week. */
const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Where subjects and periods that record no semester are shown. */
const OTHER_SEMESTER = 'Other';

type DetailTab = 'outline' | 'timetable';

const formatDate = (iso: string | null): string => {
    if (!iso) return '';
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
};

/** One day's column of periods, mirroring the back-office timetable layout. */
const DayColumn: React.FC<{ day: string; periods: AdmissionPeriod[] }> = ({ day, periods }) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <Box
            sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha('#76a345', 0.2),
                overflow: 'hidden',
                bgcolor: 'background.paper'
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1.25,
                    bgcolor: alpha('#76a345', 0.08),
                    borderBottom: '1px solid',
                    borderColor: alpha('#76a345', 0.15)
                }}
            >
                <Typography sx={{ fontWeight: 900, color: 'primary.dark' }}>{day}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {periods.length === 0
                        ? 'No periods'
                        : `${periods.length} ${periods.length === 1 ? 'period' : 'periods'}`}
                </Typography>
            </Box>

            <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {periods.length === 0 && (
                    <Typography variant="body2" sx={{ color: 'text.disabled', px: 0.5 }}>
                        —
                    </Typography>
                )}

                {periods.map((period, index) => (
                    <Box
                        key={`${day}-${index}`}
                        sx={{
                            p: 1.25,
                            borderRadius: 2,
                            bgcolor: alpha('#76a345', 0.04),
                            borderLeft: '3px solid',
                            borderColor: 'primary.main'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: 'primary.dark',
                                mb: 0.5
                            }}
                        >
                            <ScheduleIcon sx={{ fontSize: '0.85rem' }} />
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                {period.startTime} – {period.endTime}
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.35 }}
                        >
                            {period.subject || 'Scheduled period'}
                        </Typography>
                        {period.teacher && (
                            <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
                            >
                                {period.teacher}
                            </Typography>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    </Grid>
);

const ProgramDetailPage: React.FC = () => {
    const { registerId } = useParams<{ registerId: string }>();
    const navigate = useNavigate();
    const id = Number(registerId);

    const dispatch = useDispatch<AppDispatch>();
    const [programId, setProgramId] = useState<number | ''>('');
    const [tab, setTab] = useState<DetailTab>('outline');
    const [error, setError] = useState<string | null>(null);

    const register = useSelector(selectRegister(id));
    const detail = useSelector((state: RootState) =>
        programId === '' ? undefined : selectProgramDetail(id, programId)(state)
    );
    const isLoading = useSelector(
        (state: RootState) =>
            state.admission.registers[id] === undefined &&
            state.admission.pending.includes(`register:${id}`)
    );
    const isLoadingDetail = useSelector(
        (state: RootState) =>
            programId !== '' &&
            state.admission.programs[`${id}:${programId}`] === undefined &&
            state.admission.pending.includes(`program:${id}:${programId}`)
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!Number.isFinite(id)) {
            setError('That intake could not be found.');
            return;
        }

        dispatch(loadRegister({ registerId: id }))
            .unwrap()
            .then((data) => setError(data ? null : 'That intake is no longer open for applications.'))
            .catch((err: unknown) => {
                if (err && typeof err === 'object' && 'name' in err && err.name === 'ConditionError') {
                    return;
                }
                setError('We could not load this intake just now. Please try again shortly.');
            });
    }, [dispatch, id]);

    // Default to the first programme once the intake is known.
    useEffect(() => {
        if (programId === '' && register && register.programs.length > 0) {
            setProgramId(register.programs[0].id);
        }
    }, [register, programId]);

    useEffect(() => {
        if (programId === '' || !Number.isFinite(id)) return;
        dispatch(loadProgramDetail({ registerId: id, programId }));
    }, [dispatch, id, programId]);

    // Semesters the programme records, in teaching order. Subjects and periods
    // that carry no semester are collected under a trailing "Other" group so
    // nothing is dropped from either tab.
    const semesters = useMemo(() => {
        if (!detail) return [] as string[];

        const named = detail.semesters.filter((name) => name.trim().length > 0);
        const hasUngrouped =
            detail.courseOutline.some((subject) => !subject.semester.trim()) ||
            detail.periods.some((period) => !period.semester.trim());

        return hasUngrouped ? [...named, OTHER_SEMESTER] : named;
    }, [detail]);

    const [semester, setSemester] = useState<string>('');

    // Settle on the first semester as soon as one is known, and recover if the
    // selected one disappears after switching programme.
    useEffect(() => {
        if (semesters.length === 0) {
            if (semester !== '') setSemester('');
            return;
        }
        if (!semesters.includes(semester)) {
            setSemester(semesters[0]);
        }
    }, [semesters, semester]);

    const groupOf = (name: string): string => (name.trim() ? name.trim() : OTHER_SEMESTER);

    /** Subjects in the chosen semester, or all of them when none are recorded. */
    const outline = useMemo<AdmissionSubject[]>(() => {
        if (!detail) return [];
        if (semesters.length === 0) return detail.courseOutline;
        return detail.courseOutline.filter((subject) => groupOf(subject.semester) === semester);
    }, [detail, semesters, semester]);

    /** The chosen semester's periods bucketed into fixed weekday columns. */
    const byDay = useMemo(() => {
        const days = new Map<string, AdmissionPeriod[]>(WEEK.map((day) => [day, []]));
        const periods =
            semesters.length === 0
                ? detail?.periods ?? []
                : (detail?.periods ?? []).filter(
                      (period) => groupOf(period.semester) === semester
                  );
        periods.forEach((period) => {
            days.get(period.day)?.push(period);
        });
        return days;
    }, [detail, semesters, semester]);

    const periodCount = useMemo(
        () => Array.from(byDay.values()).reduce((total, periods) => total + periods.length, 0),
        [byDay]
    );

    // Carry the intake (and the programme being viewed) to the board, so the
    // enquiry form opens on the right one instead of a bare list.
    const goToApply = useCallback(() => {
        navigate('/admission', {
            state: {
                applyRegisterId: id,
                applyProgramId: programId === '' ? undefined : programId
            }
        });
    }, [navigate, id, programId]);

    if (isLoading && !register) {
        return (
            <Box sx={{ pt: { xs: 12, md: 16 }, pb: 10, bgcolor: 'background.default', minHeight: '100vh' }}>
                <Container maxWidth="lg">
                    <Skeleton variant="text" width={320} height={32} />
                    <Skeleton variant="rounded" height={140} sx={{ my: 3, borderRadius: 3 }} />
                    <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
                </Container>
            </Box>
        );
    }

    if (error || !register) {
        return (
            <Box sx={{ pt: { xs: 12, md: 16 }, pb: 10, bgcolor: 'background.default', minHeight: '100vh' }}>
                <Container maxWidth="lg">
                    <Alert severity="info" sx={{ mb: 3 }}>
                        {error ?? 'That intake could not be found.'}
                    </Alert>
                    <Button
                        component={RouterLink}
                        to="/admission"
                        variant="contained"
                        sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}
                    >
                        Back to Admissions
                    </Button>
                </Container>
            </Box>
        );
    }

    const closes = formatDate(register.endDate);

    return (
        <Box sx={{ pt: { xs: 12, md: 16 }, pb: 10, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Container maxWidth="lg">
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
                    <Link component={RouterLink} to="/" underline="hover" color="text.secondary">
                        Home
                    </Link>
                    <Link component={RouterLink} to="/admission" underline="hover" color="text.secondary">
                        Admission
                    </Link>
                    <Typography color="text.primary" sx={{ fontWeight: 600 }}>
                        {register.schoolName}
                    </Typography>
                </Breadcrumbs>

                {/* Intake header */}
                <Box
                    sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: alpha('#76a345', 0.15),
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 3
                    }}
                >
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            flexShrink: 0,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: alpha('#76a345', 0.15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}
                    >
                        {register.hasLogo ? (
                            <Box
                                component="img"
                                src={schoolLogoUrl(register.schoolCode)}
                                alt=""
                                sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 0.5 }}
                            />
                        ) : (
                            <SchoolIcon sx={{ color: 'primary.main', fontSize: '2.2rem' }} />
                        )}
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                            {register.schoolName}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                mt: 0.75,
                                color: 'text.secondary'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ApartmentIcon sx={{ fontSize: '1rem' }} />
                                <Typography variant="body2">{register.campusName}</Typography>
                            </Box>
                            {register.city && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <LocationOnIcon sx={{ fontSize: '1rem' }} />
                                    <Typography variant="body2">{register.city}</Typography>
                                </Box>
                            )}
                            {closes && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <EventIcon sx={{ fontSize: '1rem' }} />
                                    <Typography variant="body2">Closes {closes}</Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={goToApply}
                        sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700, flexShrink: 0 }}
                    >
                        Apply
                    </Button>
                </Box>

                {/* Programme picker */}
                <Box sx={{ mt: 4, mb: 3, maxWidth: 480 }}>
                    <TextField
                        select
                        fullWidth
                        label="Class or programme"
                        value={programId}
                        onChange={(event) => setProgramId(Number(event.target.value))}
                        helperText={
                            register.academicSession ? `Session: ${register.academicSession}` : ' '
                        }
                    >
                        {register.programs.map((program) => (
                            <MenuItem key={program.id} value={program.id}>
                                {program.name}
                                {program.seats != null && ` — ${program.seats} seats`}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {isLoadingDetail && <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />}

                {detail && !isLoadingDetail && (
                    <>
                        <Tabs
                            value={tab}
                            onChange={(_, next: DetailTab) => setTab(next)}
                            sx={{
                                mb: semesters.length > 0 ? 1 : 3,
                                borderBottom: '1px solid',
                                borderColor: alpha('#76a345', 0.2),
                                '& .MuiTab-root': { fontWeight: 800, textTransform: 'none' }
                            }}
                        >
                            <Tab value="outline" label="Course Outline" />
                            <Tab value="timetable" label="Timetable" />
                        </Tabs>

                        {/* One semester at a time, shared by both tabs so switching
                            between them keeps you on the semester you were reading. */}
                        {semesters.length > 0 && (
                            <Tabs
                                value={semester}
                                onChange={(_, next: string) => setSemester(next)}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    mb: 3,
                                    minHeight: 40,
                                    '& .MuiTab-root': {
                                        minHeight: 40,
                                        py: 0.5,
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        color: 'text.secondary'
                                    }
                                }}
                            >
                                {semesters.map((name) => (
                                    <Tab key={name} value={name} label={name} />
                                ))}
                            </Tabs>
                        )}

                        {tab === 'outline' &&
                            (outline.length === 0 ? (
                                <Alert severity="info">
                                    No courses have been published for this programme yet.
                                </Alert>
                            ) : (
                                <>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 0.8 }}
                                    >
                                        {outline.length === 1 ? '1 COURSE' : outline.length + ' COURSES'}
                                    </Typography>
                                    <Box sx={{ mt: 1.25, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                        {outline.map((subject) => (
                                            <Chip
                                                key={subject.name}
                                                label={subject.name}
                                                variant="outlined"
                                                sx={{
                                                    borderColor: alpha('#76a345', 0.35),
                                                    color: 'text.secondary'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </>
                            ))}

                        {tab === 'timetable' &&
                            (periodCount === 0 ? (
                                <Alert severity="info">
                                    No timetable has been published for this programme yet.
                                </Alert>
                            ) : (
                                <Grid container spacing={2} alignItems="stretch">
                                    {WEEK.map((day) => (
                                        <DayColumn key={day} day={day} periods={byDay.get(day) ?? []} />
                                    ))}
                                </Grid>
                            ))}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default ProgramDetailPage;
