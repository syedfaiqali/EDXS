import React from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';

interface ValidationToastProps {
    open: boolean;
    message: string;
    onClose: () => void;
}

const ValidationToast: React.FC<ValidationToastProps> = ({ open, message, onClose }) => {
    const { t } = useLanguage();

    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ mt: 10, mr: 2 }}
        >
            <Alert
                onClose={onClose}
                severity="error"
                variant="filled"
                sx={{
                    width: '100%',
                    minWidth: { xs: '90vw', sm: 400 },
                    bgcolor: '#76a345', // Using Theme Dark Blue
                    borderRadius: 4,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        background: 'linear-gradient(45deg, #76a345, #94bc65, #76a345)',
                        borderRadius: 4,
                        zIndex: -1,
                        opacity: 0.6,
                        filter: 'blur(8px)',
                    },
                    '& .MuiAlert-message': {
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        position: 'relative',
                        zIndex: 1,
                        py: 1
                    },
                    '& .MuiAlert-action': {
                        position: 'relative',
                        zIndex: 1,
                        '& .MuiIconButton-root': {
                            color: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.2)',
                                transform: 'rotate(90deg)',
                                transition: 'all 0.3s ease'
                            }
                        }
                    }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, width: '100%' }}>
                    <Box sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                        border: '2px solid rgba(255,255,255,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        animation: 'bounce 1s ease-in-out infinite',
                        '@keyframes bounce': {
                            '0%, 100%': { transform: 'translateY(0) scale(1)' },
                            '50%': { transform: 'translateY(-8px) scale(1.05)' }
                        }
                    }}>
                        <Typography sx={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                            ⚠️
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{
                            fontWeight: 800,
                            fontSize: '1.05rem',
                            color: '#fff',
                            mb: 0.5,
                            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            letterSpacing: '0.3px'
                        }}>
                            ⚡ {t('validation_required')}
                        </Typography>
                        <Typography sx={{
                            fontSize: '0.9rem',
                            color: 'rgba(255,255,255,0.95)',
                            lineHeight: 1.5,
                            fontWeight: 500,
                            textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                        }}>
                            {message}
                        </Typography>
                    </Box>
                </Box>
            </Alert>
        </Snackbar>
    );
};

export default ValidationToast;
