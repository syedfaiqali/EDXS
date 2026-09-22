import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    MenuItem,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    alpha
} from '@mui/material';
import {
    fetchAdmissionSchools,
    fetchAdmissionStatus,
    type AdmissionSchool,
    type AdmissionStatus
} from '../api/admission';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

/**
 * Looks up an admission application by its reference.
 *
 * This lives in the top navigation rather than on the Admission page, because
 * someone checking on an application they already submitted has no reason to
 * scroll past the intakes they are no longer choosing between.
 */
const CheckStatusDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const [schools, setSchools] = useState<AdmissionSchool[]>([]);
    const [schoolCode, setSchoolCode] = useState('');
    const [token, setToken] = useState('');
    const [result, setResult] = useState<AdmissionStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    // The school list is only needed once the dialog is actually opened.
    useEffect(() => {
        if (!open || schools.length > 0) {
            return;
        }

        const controller = new AbortController();
        fetchAdmissionSchools(controller.signal)
            .then(setSchools)
            .catch(() => {
                // The lookup is still usable if the list fails: the visitor just
                // has no dropdown to pick from, so nothing is reported here.
            });
        return () => controller.abort();
    }, [open, schools.length]);

    const handleCheck = useCallback(async () => {
        if (!schoolCode || !token.trim()) return;
        setIsChecking(true);
        setError(null);
        setResult(null);
        try {
            const status = await fetchAdmissionStatus(schoolCode, token.trim());
            if (status) {
                setResult(status);
            } else {
                setError('We could not find an application with that reference.');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'We could not check that reference just now.');
        } finally {
            setIsChecking(false);
        }
    }, [schoolCode, token]);

    const handleClose = useCallback(() => {
        setResult(null);
        setError(null);
        onClose();
    }, [onClose]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pr: 7 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>
                    Check Application Status
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Enter the reference you were given when you applied.
                </Typography>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        select
                        fullWidth
                        label="School"
                        value={schoolCode}
                        onChange={(event) => setSchoolCode(event.target.value)}
                        helperText={schools.length === 0 ? 'Loading schools…' : ' '}
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
                        value={token}
                        onChange={(event) => setToken(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') handleCheck();
                        }}
                    />
                </Box>

                {error && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                        {error}
                    </Alert>
                )}

                {result && (
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
                            {result.studentName || result.applicantName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            {result.currentStatus}
                            {result.submittedOn &&
                                ` · Submitted ${new Date(result.submittedOn).toLocaleDateString()}`}
                        </Typography>

                        {result.steps.map((step) => (
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
                                            color: step.state === 'upcoming' ? 'text.secondary' : 'text.primary'
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
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>
                    Close
                </Button>
                <Button
                    variant="contained"
                    onClick={handleCheck}
                    disabled={!schoolCode || !token.trim() || isChecking}
                    sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}
                >
                    {isChecking ? 'Checking…' : 'Check Status'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CheckStatusDialog;
