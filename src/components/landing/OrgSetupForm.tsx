import React from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Divider, Fade, MenuItem } from '@mui/material';
import { ArrowBack, CheckCircleOutline, Settings, Palette, Landscape } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import type { OrgFormData, SelectedOrg } from './types';

interface OrgSetupFormProps {
    selectedOrg: SelectedOrg;
    orgData: OrgFormData;
    orgErrors: Partial<Record<keyof OrgFormData, boolean>>;
    orgFieldRefs: React.MutableRefObject<Partial<Record<keyof OrgFormData, HTMLInputElement>>>;
    onBack: () => void;
    onDone: () => void;
    onChange: (field: keyof OrgFormData) => (event: React.ChangeEvent<HTMLInputElement>) => void;
    onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const OrgSetupForm: React.FC<OrgSetupFormProps> = ({
    selectedOrg, orgData, orgErrors, orgFieldRefs, onBack, onDone, onChange, onLogoUpload
}) => {
    const { t, language } = useLanguage();

    return (
        <Fade in timeout={800}>
            <Box>
                <Paper sx={{ p: 6, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.95)' }}>
                    <Button
                        startIcon={<ArrowBack sx={{ ...(language !== 'English' && { transform: 'rotate(180deg)' }) }} />}
                        onClick={onBack}
                        sx={{ mb: 4 }}
                    >
                        {t('back')}
                    </Button>
                    <Typography variant="h2" gutterBottom color="primary">
                        {selectedOrg.name} {t('organization_setup')}
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        {t('configure_the_core_settings_and_branding_for_your')} {selectedOrg.name.toLowerCase()}.
                    </Typography>

                    <Divider sx={{ my: 4 }} />

                    <Grid container spacing={6}>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Settings color="primary" sx={{ mr: 1.5 }} />
                                {t('core_settings')}
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label={`${selectedOrg.name} ${t('name')} `}
                                        value={orgData.institutionName}
                                        onChange={onChange('institutionName')}
                                        error={!!orgErrors.institutionName}
                                        inputProps={{ maxLength: 100 }}
                                        inputRef={(el: HTMLInputElement) => { if (el) orgFieldRefs.current.institutionName = el; }}
                                        required
                                    />
                                </Grid>

                                {selectedOrg.type === 'school' && (
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label={t('curriculum')}
                                            placeholder={t('curriculum_placeholder')}
                                            value={orgData.curriculum}
                                            onChange={onChange('curriculum')}
                                            error={!!orgErrors.curriculum}
                                            inputRef={(el: HTMLInputElement) => { if (el) orgFieldRefs.current.curriculum = el; }}
                                            required
                                        />
                                    </Grid>
                                )}

                                {selectedOrg.type === 'college' && (
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label={t('affiliation_board')}
                                            placeholder={t('affiliation_placeholder')}
                                            value={orgData.affiliation}
                                            onChange={onChange('affiliation')}
                                            error={!!orgErrors.affiliation}
                                            inputRef={(el: HTMLInputElement) => { if (el) orgFieldRefs.current.affiliation = el; }}
                                            required
                                        />
                                    </Grid>
                                )}

                                {selectedOrg.type === 'university' && (
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label={t('hec_id_registration_no')}
                                            placeholder={t('hec_id_placeholder')}
                                            value={orgData.hecId}
                                            onChange={onChange('hecId')}
                                            error={!!orgErrors.hecId}
                                            inputRef={(el: HTMLInputElement) => { if (el) orgFieldRefs.current.hecId = el; }}
                                            required
                                        />
                                    </Grid>
                                )}

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label={t('organization_code')}
                                        placeholder="EB-2024"
                                        value={orgData.code}
                                        onChange={onChange('code')}
                                        error={!!orgErrors.code}
                                        inputProps={{ maxLength: 20 }}
                                        inputRef={(el: HTMLInputElement) => { if (el) orgFieldRefs.current.code = el; }}
                                        required
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        select
                                        label={t('fiscal_year')}
                                        value={orgData.fiscalYear}
                                        onChange={onChange('fiscalYear')}
                                    >
                                        <MenuItem value="2023-24">2023-24</MenuItem>
                                        <MenuItem value="2024-25">2024-25</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                            <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Palette color="primary" sx={{ mr: 1.5 }} />
                                {t('branding')}
                            </Typography>

                            <Box
                                sx={{
                                    border: '2px dashed',
                                    borderColor: orgData.logo ? selectedOrg.color : 'rgba(0,0,0,0.1)',
                                    borderRadius: 4,
                                    p: 4,
                                    textAlign: 'center',
                                    backgroundColor: orgData.logo ? `${selectedOrg.color}05` : 'rgba(0,0,0,0.02)',
                                    minHeight: 280,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: selectedOrg.color,
                                        bgcolor: `${selectedOrg.color}10`
                                    }
                                }}
                                component="label"
                            >
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={onLogoUpload}
                                />
                                {orgData.logo ? (
                                    <Box sx={{ position: 'relative', width: '100%' }}>
                                        <img
                                            src={orgData.logo}
                                            alt="Logo Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                objectFit: 'contain',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: selectedOrg.color, fontWeight: 700 }}>
                                            {t('click_to_change_logo')}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <>
                                        <Box sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            bgcolor: `${selectedOrg.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2
                                        }}>
                                            <Landscape sx={{ fontSize: 40, color: selectedOrg.color }} />
                                        </Box>
                                        <Typography variant="body1" fontWeight="600" gutterBottom>
                                            {t('upload_logo')}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('drag_and_drop_or_click_to_browse')}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<CheckCircleOutline />}
                            onClick={onDone}
                            sx={{ px: 6 }}
                        >
                            {t('complete_setup')}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
};

export default OrgSetupForm;
