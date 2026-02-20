import React from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

const SuccessScreen: React.FC = () => {
    const { t } = useLanguage();

    return (
        <Fade in timeout={800}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh'
            }}>
                <CheckCircleOutline sx={{ fontSize: 120, color: '#76a345', mb: 3 }} />
                <Typography variant="h2" gutterBottom color="primary" fontWeight="800">
                    {t('configuration_complete')}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                    {t('redirecting_to_selection')}
                </Typography>
            </Box>
        </Fade>
    );
};

export default SuccessScreen;
