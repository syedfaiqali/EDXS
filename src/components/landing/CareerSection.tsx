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
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Divider,
    keyframes,
    alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import {
    fetchCareers,
    buildApplyUrl,
    emptyCareersResult,
    type CareerJob,
    type CareersResult
} from '../../api/careers';
import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PAGE_SIZE = 12;
const ANY = '';

interface Filters {
    search: string;
    clientId: number | null;
    department: string;
    employmentType: string;
    campus: string;
}

const initialFilters: Filters = {
    search: '',
    clientId: null,
    department: ANY,
    employmentType: ANY,
    campus: ANY
};

/** "2 – 5 years" / "5+ years" / "" when the vacancy states no range. */
const formatExperience = (min: number | null, max: number | null): string => {
    if (min == null && max == null) return '';
    if (min != null && max != null) return `${min} – ${max} yrs exp`;
    if (min != null) return `${min}+ yrs exp`;
    return `Up to ${max} yrs exp`;
};

const formatPostedDate = (iso: string): string => {
    const posted = new Date(iso);
    if (Number.isNaN(posted.getTime())) return '';
    const days = Math.floor((Date.now() - posted.getTime()) / 86_400_000);
    if (days <= 0) return 'Posted today';
    if (days === 1) return 'Posted yesterday';
    if (days < 30) return `Posted ${days} days ago`;
    const months = Math.floor(days / 30);
    return months === 1 ? 'Posted last month' : `Posted ${months} months ago`;
};

const JobCard: React.FC<{ job: CareerJob; index: number; onOpen: (job: CareerJob) => void }> = ({
    job,
    index,
    onOpen
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 });
    const experience = formatExperience(job.minimumExperienceYears, job.maximumExperienceYears);

    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Box
                ref={cardRef}
                sx={{
                    height: '100%',
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: alpha('#76a345', 0.15),
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    opacity: isVisible ? 1 : 0,
                    animation: isVisible ? `${fadeInUp} 0.6s ease-out forwards` : 'none',
                    animationDelay: `${Math.min(index, 8) * 0.06}s`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 18px 36px rgba(118,163,69,0.15)'
                    }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1.3 }}>
                            {job.title}
                        </Typography>
                        {job.clientName && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <ApartmentIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                                <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    {job.clientName}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    {job.openings > 1 && (
                        <Chip
                            label={`${job.openings} openings`}
                            size="small"
                            sx={{ bgcolor: 'secondary.main', color: 'primary.dark', fontWeight: 800 }}
                        />
                    )}
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, color: 'text.secondary' }}>
                    {job.department && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <WorkOutlineIcon sx={{ fontSize: '1.1rem' }} />
                            <Typography variant="body2">{job.department}</Typography>
                        </Box>
                    )}
                    {job.campus && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOnIcon sx={{ fontSize: '1.1rem' }} />
                            <Typography variant="body2">{job.campus}</Typography>
                        </Box>
                    )}
                    {job.employmentType && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ScheduleIcon sx={{ fontSize: '1.1rem' }} />
                            <Typography variant="body2">{job.employmentType}</Typography>
                        </Box>
                    )}
                </Box>

                {job.description && (
                    <Typography
                        sx={{
                            color: 'text.secondary',
                            lineHeight: 1.7,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {job.description}
                    </Typography>
                )}

                <Box
                    sx={{
                        mt: 'auto',
                        pt: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        flexWrap: 'wrap'
                    }}
                >
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {[experience, formatPostedDate(job.postedAtUtc)].filter(Boolean).join(' · ')}
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => onOpen(job)}
                        sx={{
                            color: 'primary.main',
                            borderColor: 'primary.main',
                            fontWeight: 700,
                            '&:hover': { borderColor: 'primary.dark', bgcolor: alpha('#76a345', 0.08) }
                        }}
                    >
                        View Details
                    </Button>
                </Box>
            </Box>
        </Grid>
    );
};

const JobDetailDialog: React.FC<{
    job: CareerJob | null;
    onClose: () => void;
    onApply: (job: CareerJob) => void;
}> = ({ job, onClose, onApply }) => {
    if (!job) return null;

    const sections: { heading: string; body: string }[] = [
        { heading: 'About the Role', body: job.description },
        { heading: 'Responsibilities', body: job.responsibilities },
        { heading: 'Requirements', body: job.requirements },
        { heading: 'Qualifications', body: job.qualifications }
    ].filter((section) => section.body?.trim());

    return (
        <Dialog open onClose={onClose} maxWidth="md" fullWidth scroll="paper">
            <DialogTitle sx={{ pr: 7 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                    {job.title}
                </Typography>
                {job.clientName && (
                    <Typography sx={{ color: 'primary.main', fontWeight: 700, mt: 0.5 }}>
                        {job.clientName}
                    </Typography>
                )}
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {[
                        job.department,
                        job.designation,
                        job.campus,
                        job.employmentType,
                        formatExperience(job.minimumExperienceYears, job.maximumExperienceYears)
                    ]
                        .filter(Boolean)
                        .map((value) => (
                            <Chip
                                key={value}
                                label={value}
                                size="small"
                                sx={{ bgcolor: 'secondary.main', color: 'primary.dark', fontWeight: 700 }}
                            />
                        ))}
                </Box>

                {sections.length === 0 && (
                    <Typography sx={{ color: 'text.secondary' }}>
                        Full details for this role are shared during the application process.
                    </Typography>
                )}

                {sections.map((section, index) => (
                    <Box key={section.heading} sx={{ mb: 3 }}>
                        {index > 0 && <Divider sx={{ mb: 3 }} />}
                        <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>
                            {section.heading}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                            {section.body}
                        </Typography>
                    </Box>
                ))}

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Reference {job.vacancyNumber}
                    {job.closingDate && ` · Closes ${new Date(job.closingDate).toLocaleDateString()}`}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
                    Close
                </Button>
                <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => onApply(job)}
                    sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}
                >
                    Apply Now
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const CareerSection: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [page, setPage] = useState(1);
    const [result, setResult] = useState<CareersResult>(emptyCareersResult);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedJob, setSelectedJob] = useState<CareerJob | null>(null);

    const debouncedSearch = useDebouncedValue(filters.search);

    // Facets come from the whole board, so they are kept from the last
    // successful response rather than reset while a new page loads.
    const [facets, setFacets] = useState(emptyCareersResult.facets);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);

        fetchCareers(
            {
                search: debouncedSearch,
                clientId: filters.clientId,
                department: filters.department,
                employmentType: filters.employmentType,
                campus: filters.campus,
                page,
                pageSize: PAGE_SIZE
            },
            controller.signal
        )
            .then((data) => {
                setResult(data);
                if (data.facets.clients.length || data.facets.departments.length) {
                    setFacets(data.facets);
                }
                setError(null);
            })
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                setError('We could not load open roles just now. Please try again shortly.');
                setResult(emptyCareersResult);
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, [debouncedSearch, filters.clientId, filters.department, filters.employmentType, filters.campus, page]);

    // Any filter change restarts paging, otherwise a narrow filter can land on
    // a page that no longer exists.
    const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
        setFilters((current) => ({ ...current, [key]: value }));
        setPage(1);
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
        setPage(1);
    }, []);

    const hasActiveFilters = useMemo(
        () =>
            filters.search.trim() !== '' ||
            filters.clientId !== null ||
            filters.department !== ANY ||
            filters.employmentType !== ANY ||
            filters.campus !== ANY,
        [filters]
    );

    const pageCount = Math.max(1, Math.ceil(result.total / (result.pageSize || PAGE_SIZE)));

    const handleApply = useCallback(
        (job: CareerJob) => {
            const portalUrl = buildApplyUrl(job);
            if (portalUrl) {
                window.open(portalUrl, '_blank', 'noopener,noreferrer');
                return;
            }
            navigate('/contact');
        },
        [navigate]
    );

    return (
        <Box id="career-section">
            <Box sx={{ bgcolor: 'primary.main', py: { xs: 10, md: 14 }, color: 'secondary.main' }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase',
                            mb: 3
                        }}
                    >
                        Careers Across the EDXS Network
                    </Typography>
                    <Typography sx={{ fontSize: '1.25rem', lineHeight: 1.8, maxWidth: 800, color: 'white', opacity: 0.9 }}>
                        Every role currently advertised by the schools and organisations that run on EDXS, in one
                        place. Filter by employer, department, location or job type to find the one that fits.
                    </Typography>
                </Container>
            </Box>

            <Box sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    {/* Filter bar */}
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
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search job title, employer…"
                                    value={filters.search}
                                    onChange={(event) => updateFilter('search', event.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Employer"
                                    value={filters.clientId ?? ''}
                                    onChange={(event) =>
                                        updateFilter('clientId', event.target.value === '' ? null : Number(event.target.value))
                                    }
                                >
                                    <MenuItem value="">All employers</MenuItem>
                                    {facets.clients.map((client) => (
                                        <MenuItem key={client.id} value={client.id}>
                                            {client.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Department"
                                    value={filters.department}
                                    onChange={(event) => updateFilter('department', event.target.value)}
                                >
                                    <MenuItem value={ANY}>All departments</MenuItem>
                                    {facets.departments.map((department) => (
                                        <MenuItem key={department} value={department}>
                                            {department}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Job type"
                                    value={filters.employmentType}
                                    onChange={(event) => updateFilter('employmentType', event.target.value)}
                                >
                                    <MenuItem value={ANY}>All types</MenuItem>
                                    {facets.employmentTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Location"
                                    value={filters.campus}
                                    onChange={(event) => updateFilter('campus', event.target.value)}
                                >
                                    <MenuItem value={ANY}>All locations</MenuItem>
                                    {facets.campuses.map((campus) => (
                                        <MenuItem key={campus} value={campus}>
                                            {campus}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, gap: 2, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {isLoading
                                    ? 'Loading roles…'
                                    : `${result.total} ${result.total === 1 ? 'role' : 'roles'} open`}
                            </Typography>
                            {hasActiveFilters && (
                                <Button size="small" onClick={resetFilters} sx={{ color: 'primary.main', fontWeight: 700 }}>
                                    Clear filters
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {error && (
                        <Alert severity="warning" sx={{ mb: 4 }}>
                            {error}
                        </Alert>
                    )}

                    {isLoading && (
                        <Grid container spacing={4}>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Grid size={{ xs: 12, md: 6 }} key={index}>
                                    <Skeleton variant="rounded" height={220} sx={{ borderRadius: 4 }} />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {!isLoading && !error && result.jobs.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 10 }}>
                            <SearchOffIcon sx={{ fontSize: '4rem', color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                                No roles match these filters
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                                {hasActiveFilters
                                    ? 'Try widening your search, or clear the filters to see everything open.'
                                    : 'There are no vacancies advertised right now. Please check back soon.'}
                            </Typography>
                            {hasActiveFilters && (
                                <Button variant="outlined" onClick={resetFilters} sx={{ color: 'primary.main', borderColor: 'primary.main', fontWeight: 700 }}>
                                    Clear filters
                                </Button>
                            )}
                        </Box>
                    )}

                    {!isLoading && result.jobs.length > 0 && (
                        <>
                            <Grid container spacing={4}>
                                {result.jobs.map((job, index) => (
                                    <JobCard key={`${job.clientId}-${job.id}`} job={job} index={index} onOpen={setSelectedJob} />
                                ))}
                            </Grid>

                            {pageCount > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                    <Pagination
                                        count={pageCount}
                                        page={page}
                                        onChange={(_, value) => {
                                            setPage(value);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        color="primary"
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Container>
            </Box>

            <Box sx={{ bgcolor: 'secondary.main', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.dark', mb: 2 }}>
                            Hiring on EDXS?
                        </Typography>
                        <Typography sx={{ color: 'text.primary', mb: 4, fontSize: '1.1rem' }}>
                            Vacancies you approve in EDXS appear on this board automatically — no separate posting step.
                        </Typography>
                        <Button
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate('/contact')}
                            sx={{ bgcolor: 'primary.main', color: 'white', px: 4, py: 1.5, fontWeight: 700 }}
                        >
                            Talk to Us
                        </Button>
                    </Box>
                </Container>
            </Box>

            <JobDetailDialog job={selectedJob} onClose={() => setSelectedJob(null)} onApply={handleApply} />
        </Box>
    );
};

export default CareerSection;
