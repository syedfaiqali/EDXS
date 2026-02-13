import React from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Divider, Fade } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import type { FormData, SelectedOrg } from './types';

interface InfoFormProps {
    selectedOrg: SelectedOrg;
    formData: FormData;
    errors: Partial<Record<keyof FormData, boolean>>;
    fieldRefs: React.MutableRefObject<Partial<Record<keyof FormData, HTMLInputElement>>>;
    onBack: () => void;
    onNext: () => void;
    onChange: (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InfoForm: React.FC<InfoFormProps> = ({
    selectedOrg, formData, errors, fieldRefs, onBack, onNext, onChange
}) => {
    const { t, language } = useLanguage();

    return (
        <Fade in timeout={800}>
            <Box>
                <Paper sx={{ p: 6, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.95)' }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={onBack}
                        sx={{ mb: 4 }}
                    >
                        {t('back_to_selection')}
                    </Button>
                    <Typography variant="h2" gutterBottom color="primary">
                        {selectedOrg.name} {t('information')}
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        {selectedOrg.description}
                    </Typography>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h3" gutterBottom>
                        {t('basic_information')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {t('please_provide_the_following_details_to_set_up_your')} {selectedOrg.name}.
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label={t('contact_person_name')}
                                placeholder="John Doe"
                                required
                                value={formData.contactName}
                                onChange={onChange('contactName')}
                                error={!!errors.contactName}
                                inputProps={{ maxLength: 50 }}
                                inputRef={(el: HTMLInputElement) => { fieldRefs.current.contactName = el; }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label={t('designation')}
                                placeholder="Principal / Director"
                                value={formData.designation}
                                onChange={onChange('designation')}
                                inputProps={{ maxLength: 50 }}
                                inputRef={(el: HTMLInputElement) => { fieldRefs.current.designation = el; }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label={t('email_address')}
                                type="email"
                                placeholder="contact@example.com"
                                required
                                value={formData.email}
                                onChange={onChange('email')}
                                error={!!errors.email}
                                inputProps={{ maxLength: 100 }}
                                inputRef={(el: HTMLInputElement) => { fieldRefs.current.email = el; }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label={t('cell_phone_number')}
                                type="tel"
                                placeholder="+92 300 1234567"
                                required
                                value={formData.cellPhone}
                                onChange={onChange('cellPhone')}
                                error={!!errors.cellPhone}
                                inputProps={{ maxLength: 20 }}
                                inputRef={(el: HTMLInputElement) => { fieldRefs.current.cellPhone = el; }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label={t('landline_number')}
                                type="tel"
                                placeholder="+92 21 12345678"
                                value={formData.landline}
                                onChange={onChange('landline')}
                                inputProps={{ maxLength: 20 }}
                                inputRef={(el: HTMLInputElement) => { fieldRefs.current.landline = el; }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label={t('website')}
                                type="url"
                                placeholder="www.example.com"
                                value={formData.website}
                                onChange={onChange('website')}
                                inputProps={{ maxLength: 100 }}
                                inputRef={(el: HTMLInputElement) => { fieldRefs.current.website = el; }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label={t('address')}
                                placeholder={t('street_address')}
                                multiline
                                rows={2}
                                required
                                value={formData.address}
                                onChange={onChange('address')}
                                error={!!errors.address}
                                inputProps={{ maxLength: 250 }}
                                inputRef={(el: HTMLInputElement) => { fieldRefs.current.address = el; }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label={t('city')}
                                placeholder={t('karachi')}
                                required
                                value={formData.city}
                                onChange={onChange('city')}
                                error={!!errors.city}
                                inputProps={{ maxLength: 50 }}
                                inputRef={(el: HTMLInputElement) => { fieldRefs.current.city = el; }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label={t('state_province')}
                                placeholder={t('sindh')}
                                value={formData.state}
                                onChange={onChange('state')}
                                inputProps={{ maxLength: 50 }}
                                inputRef={(el: HTMLInputElement) => { fieldRefs.current.state = el; }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label={t('postal_code')}
                                placeholder={t('75500')}
                                value={formData.postalCode}
                                onChange={onChange('postalCode')}
                                inputProps={{ maxLength: 15 }}
                                inputRef={(el: HTMLInputElement) => { if (el) fieldRefs.current.postalCode = el; }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward sx={{ ...(language !== 'English' && { transform: 'rotate(180deg)' }) }} />}
                            onClick={onNext}
                        >
                            {t('next')}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
};

export default InfoForm;
