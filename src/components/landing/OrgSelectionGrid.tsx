import React from 'react';
import { Box, Typography, Grid, Paper, Fade } from '@mui/material';
import { School, Business, AccountBalance, Engineering, BusinessCenter, ChevronRight } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import type { OrgType } from './types';

interface OrgSelectionGridProps {
    onSelect: (type: OrgType, name: string, subtitle: string, description: string, color: string) => void;
}

const OrgSelectionGrid: React.FC<OrgSelectionGridProps> = ({ onSelect }) => {
    const { t, language } = useLanguage();

    const cards = [
        {
            type: 'school' as const,
            name: t('school'),
            subtitle: t('school_subtitle'),
            description: t('school_desc'),
            icon: <School sx={{ fontSize: 40 }} />,
            color: '#76a345',
            lightColor: '#eef6e3',
        },
        {
            type: 'college' as const,
            name: t('college'),
            subtitle: t('college_subtitle'),
            description: t('college_desc'),
            icon: <Business sx={{ fontSize: 40 }} />,
            color: '#7c3aed',
            lightColor: '#f5f3ff',
        },
        {
            type: 'university' as const,
            name: t('university'),
            subtitle: t('univ_subtitle'),
            description: t('univ_desc'),
            icon: <AccountBalance sx={{ fontSize: 40 }} />,
            color: '#059669',
            lightColor: '#ecfdf5',
        },
        {
            type: 'training' as const,
            name: t('training'),
            subtitle: t('training_subtitle'),
            description: t('training_desc'),
            icon: <Engineering sx={{ fontSize: 40 }} />,
            color: '#e11d48',
            lightColor: '#fff1f2',
        },
        {
            type: 'corporate' as const,
            name: t('corporate'),
            subtitle: t('corp_subtitle'),
            description: t('corp_desc'),
            icon: <BusinessCenter sx={{ fontSize: 40 }} />,
            color: '#334155',
            lightColor: '#f8fafc',
        },
    ];

    return (
        <Fade in timeout={800}>
            <Box>
                <Box textAlign="center" mb={10}>
                    <Typography variant="h2" fontWeight="800" color="primary" sx={{ mb: 2 }}>
                        {t('select_your')} <Box component="span" sx={{ color: '#76a345' }}>{t('organization_type')}</Box>
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontWeight: 500 }}>
                        {t('get_started_desc')}
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {cards.map((card) => (
                        <Grid size={{ xs: 12, md: 4 }} key={card.type}>
                            <Paper
                                elevation={0}
                                onClick={() => onSelect(card.type, card.name, card.subtitle, card.description, card.color)}
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    cursor: 'pointer',
                                    borderRadius: 4,
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    bgcolor: 'white',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-12px)',
                                        boxShadow: `0 20px 40px -12px ${card.color}25`,
                                        borderColor: card.color,
                                        '& .icon-box': {
                                            transform: 'scale(1.1) rotate(-5deg)',
                                            bgcolor: card.color,
                                            color: 'white',
                                        }
                                    },
                                }}
                            >
                                <Box
                                    className="icon-box"
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 3,
                                        bgcolor: card.lightColor,
                                        color: card.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 3,
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {card.icon}
                                </Box>

                                <Typography variant="h4" gutterBottom fontWeight="700">
                                    {card.name}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}>
                                    {card.subtitle}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                                    {card.description}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                                    <Typography variant="button" sx={{ color: card.color, fontWeight: 700 }}>
                                        {t('enter_module')}
                                    </Typography>
                                    <ChevronRight sx={{
                                        ml: 1,
                                        color: card.color,
                                        ...(language !== 'English' && { transform: 'rotate(180deg)' })
                                    }} />
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Fade>
    );
};

export default OrgSelectionGrid;
