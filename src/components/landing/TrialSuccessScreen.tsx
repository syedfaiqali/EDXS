import React, { useEffect, useState } from 'react';
import { Box, Button, Fade, Paper, Stack, Typography } from '@mui/material';
import { CheckCircleOutline, Schedule } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { TRIAL_DAYS, trialLoginUrl } from '../../api/trial';
import type { TrialSignupResult } from '../../api/trial';

/** How long the confirmation stays up before the login page is opened. */
const REDIRECT_SECONDS = 8;

interface TrialSuccessScreenProps {
    result: TrialSignupResult;
}

/**
 * Where a visitor lands once the trial client exists.
 *
 * The screen holds for a few seconds before sending them to the login page:
 * long enough to note the username, which is the only copy they have, but
 * without making them hunt for a button. The countdown says what is about to
 * happen, and either button lets them leave sooner or stay put.
 */
const TrialSuccessScreen: React.FC<TrialSuccessScreenProps> = ({ result }) => {
    const { t } = useLanguage();

    const loginUrl = trialLoginUrl();
    const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        // Nothing to count towards when the deployment has no login URL, and a
        // visitor who chose to stay is not sent anywhere.
        if (!loginUrl || cancelled) return;

        if (secondsLeft <= 0) {
            window.location.assign(loginUrl);
            return;
        }

        const timer = window.setTimeout(() => setSecondsLeft(value => value - 1), 1000);
        return () => window.clearTimeout(timer);
    }, [secondsLeft, cancelled, loginUrl]);

    return (
        <Fade in timeout={800}>
            <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
                <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 0, maxWidth: 640, textAlign: 'center' }}>
                    <CheckCircleOutline sx={{ fontSize: 96, color: '#76a345', mb: 2 }} />

                    <Typography variant="h2" gutterBottom color="primary" fontWeight="800">
                        {t('trial_ready_title')}
                    </Typography>

                    <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
                        {t('trial_ready_body', { name: result.clientName, user: result.userName })}
                    </Typography>

                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                        bgcolor: '#eef6e3', border: '1px solid #cfe3b4', borderRadius: 0, p: 2, mb: 3
                    }}>
                        <Schedule sx={{ color: '#6f963f' }} />
                        <Typography variant="body2" sx={{ color: '#33491c', fontWeight: 600 }}>
                            {t('trial_ready_expiry', { date: result.trialEndsOn, days: String(TRIAL_DAYS) })}
                        </Typography>
                    </Box>

                    {loginUrl && !cancelled && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {t('trial_redirecting', { seconds: String(secondsLeft) })}
                        </Typography>
                    )}

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        {loginUrl && (
                            <Button
                                variant="contained"
                                size="large"
                                href={loginUrl}
                                sx={{ px: 5, borderRadius: 0 }}
                            >
                                {t('go_to_login')}
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            size="large"
                            component={Link}
                            to="/"
                            onClick={() => setCancelled(true)}
                            sx={{ px: 5, borderRadius: 0 }}
                        >
                            {t('back_to_home')}
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </Fade>
    );
};

export default TrialSuccessScreen;
