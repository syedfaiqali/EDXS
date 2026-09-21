import React, { useRef } from 'react';
import { Box, Typography, Container, Grid, Button, keyframes, alpha } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import AdmissionApply from './AdmissionApply';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface Step {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const steps: Step[] = [
    {
        title: 'Submit the Enquiry Form',
        description: 'Tell us about the student, the year group and the program of interest. It takes about five minutes.',
        icon: <AssignmentIcon sx={{ fontSize: '2.75rem' }} />
    },
    {
        title: 'Upload Documents',
        description: 'Previous school reports, birth certificate and identification are uploaded once and stored securely.',
        icon: <UploadFileIcon sx={{ fontSize: '2.75rem' }} />
    },
    {
        title: 'Assessment & Interview',
        description: 'We schedule a placement assessment and a short family interview at a time that suits you.',
        icon: <EventAvailableIcon sx={{ fontSize: '2.75rem' }} />
    },
    {
        title: 'Offer & Enrolment',
        description: 'Offers are issued through the portal, with fee schedules and enrolment confirmation in one place.',
        icon: <CelebrationIcon sx={{ fontSize: '2.75rem' }} />
    }
];

const requirements = [
    'Completed online application form',
    'Two most recent school report cards',
    'Copy of birth certificate or passport',
    'Guardian identification and proof of address',
    'Immunisation and medical records',
    'Transfer certificate from the previous school, where applicable'
];

const dates = [
    { term: 'Autumn Intake', open: '01 March', close: '31 May', starts: 'September' },
    { term: 'Spring Intake', open: '01 September', close: '30 November', starts: 'January' },
    { term: 'Rolling Admissions', open: 'Year-round', close: 'Subject to seats', starts: 'Next term' }
];

const StepCard: React.FC<{ step: Step; index: number }> = ({ step, index }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(cardRef, { threshold: 0.15 });

    return (
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
                ref={cardRef}
                sx={{
                    height: '100%',
                    p: 4,
                    borderRadius: 4,
                    bgcolor: alpha('#fff', 0.1),
                    border: '1px solid',
                    borderColor: alpha('#f0dbb0', 0.4),
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    opacity: isVisible ? 1 : 0,
                    animation: isVisible ? `${fadeInUp} 0.7s ease-out forwards` : 'none',
                    animationDelay: `${index * 0.12}s`
                }}
            >
                <Typography sx={{ color: 'secondary.main', fontWeight: 900, fontSize: '0.85rem', letterSpacing: 2 }}>
                    STEP {index + 1}
                </Typography>
                <Box sx={{ color: 'secondary.main' }}>{step.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'secondary.main' }}>
                    {step.title}
                </Typography>
                <Typography sx={{ color: 'white', opacity: 0.9, lineHeight: 1.7 }}>
                    {step.description}
                </Typography>
            </Box>
        </Grid>
    );
};

const AdmissionSection: React.FC = () => {

    return (
        <Box id="admission-section">
            <Box sx={{ bgcolor: 'secondary.main', py: { xs: 10, md: 14 } }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase',
                            color: 'primary.dark',
                            mb: 3
                        }}
                    >
                        Admissions, Without the Paperwork
                    </Typography>
                    <Typography sx={{ fontSize: '1.25rem', lineHeight: 1.8, maxWidth: 800, color: 'text.primary' }}>
                        Every application runs through the EDXS portal — documents, assessments, offers and fee
                        confirmation in a single trackable flow that families and registrars can both follow.
                    </Typography>
                </Container>
            </Box>

            <AdmissionApply />

            <Box sx={{ bgcolor: 'primary.main', py: { xs: 10, md: 14 } }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'secondary.main', mb: 6, textTransform: 'uppercase' }}>
                        How It Works
                    </Typography>
                    <Grid container spacing={4}>
                        {steps.map((step, index) => (
                            <StepCard key={step.title} step={step} index={index} />
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ bgcolor: 'background.default', py: { xs: 10, md: 14 } }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, color: 'text.primary' }}>
                                What You'll Need
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {requirements.map((item) => (
                                    <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <CheckCircleOutlineIcon sx={{ color: 'primary.main', mt: 0.3 }} />
                                        <Typography sx={{ color: 'text.secondary', fontSize: '1.05rem' }}>
                                            {item}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, color: 'text.primary' }}>
                                Key Dates
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {dates.map((d) => (
                                    <Box
                                        key={d.term}
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            bgcolor: 'background.paper',
                                            border: '1px solid',
                                            borderColor: alpha('#76a345', 0.2)
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}>
                                            {d.term}
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {[
                                                { label: 'Opens', value: d.open },
                                                { label: 'Closes', value: d.close },
                                                { label: 'Term Starts', value: d.starts }
                                            ].map((cell) => (
                                                <Grid size={4} key={cell.label}>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                                        {cell.label}
                                                    </Typography>
                                                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                        {cell.value}
                                                    </Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: 10 }}>
                        <Button
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() =>
                                document
                                    .getElementById('admission-apply')
                                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }
                            sx={{ bgcolor: 'primary.main', color: 'white', px: 5, py: 1.75, fontWeight: 700, fontSize: '1.05rem' }}
                        >
                            Back to the Application Form
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default AdmissionSection;
