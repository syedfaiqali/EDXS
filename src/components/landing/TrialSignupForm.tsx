import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert, Box, Button, Checkbox, Chip, Divider, Fade, FormControlLabel, Grid,
    IconButton, InputAdornment, MenuItem, Paper, TextField, Typography
} from '@mui/material';
import {
    ArrowBack, Badge, Business, CheckCircleOutline, Person, RocketLaunch,
    Schedule, Visibility, VisibilityOff
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    TRIAL_DAYS, checkTrialAvailability, fetchTrialCities, fetchTrialCountries,
    fetchTrialModules, fetchTrialStates, trialEndDate
} from '../../api/trial';
import type { TrialLocation, TrialLookup } from '../../api/trial';
import type { TrialFormData } from './trialFormData';
import type { SelectedOrg } from './types';

interface TrialSignupFormProps {
    selectedOrg: SelectedOrg;
    data: TrialFormData;
    errors: Partial<Record<keyof TrialFormData, string>>;
    moduleIds: number[];
    submitting: boolean;
    submitError: string;
    fieldRefs: React.MutableRefObject<Partial<Record<keyof TrialFormData, HTMLInputElement>>>;
    onBack: () => void;
    onChange: (field: keyof TrialFormData, value: string) => void;
    onModulesChange: (moduleIds: number[]) => void;
    onSubmit: (modules: TrialLookup[]) => void;
}

/** A labelled section heading, matching the back office's grouped form. */
const SectionHeading: React.FC<{ icon: React.ReactNode; title: string; color: string }> = ({ icon, title, color }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{
            width: 40, height: 40, borderRadius: 0, bgcolor: `${color}15`, color,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            {icon}
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>{title}</Typography>
    </Box>
);

const TrialSignupForm: React.FC<TrialSignupFormProps> = ({
    selectedOrg, data, errors, moduleIds, submitting, submitError,
    fieldRefs, onBack, onChange, onModulesChange, onSubmit
}) => {
    const { t, language } = useLanguage();

    const [modules, setModules] = useState<TrialLookup[]>([]);
    const [countries, setCountries] = useState<TrialLocation[]>([]);
    const [states, setStates] = useState<{ country: string; list: TrialLocation[] }>({ country: '', list: [] });
    const [cities, setCities] = useState<{ key: string; list: TrialLocation[] }>({ key: '', list: [] });
    const [lookupError, setLookupError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [nameTaken, setNameTaken] = useState({ client: '', user: '' });

    const endsOn = useMemo(() => trialEndDate(), []);

    // The module and country lists are the same for every visitor, so they load
    // once when the form opens. A lookup that fails leaves the form usable -
    // modules and location are optional - with a note explaining what is missing.
    useEffect(() => {
        const controller = new AbortController();

        Promise.all([
            fetchTrialModules(controller.signal),
            fetchTrialCountries(controller.signal)
        ])
            .then(([loadedModules, loadedCountries]) => {
                setModules(loadedModules);
                setCountries(loadedCountries);
            })
            .catch((error: Error) => {
                if (error.name !== 'AbortError') setLookupError(error.message);
            });

        return () => controller.abort();
    }, []);

    // States and cities narrow as the visitor picks: the country's states, then
    // that state's cities. Each fetched list is keyed by the selection it was
    // loaded for, so clearing the parent empties the child list on render rather
    // than through a second state write.
    useEffect(() => {
        const country = data.country;
        if (!country) return;

        const controller = new AbortController();
        fetchTrialStates(country, controller.signal)
            .then(loaded => setStates({ country, list: loaded }))
            .catch(() => setStates({ country, list: [] }));

        return () => controller.abort();
    }, [data.country]);

    // Country and state together, as a state name can repeat across countries.
    const cityKey = `${data.country}\n${data.state}`;

    useEffect(() => {
        if (!data.country || !data.state) return;

        const key = cityKey;
        const controller = new AbortController();
        fetchTrialCities(data.country, data.state, controller.signal)
            .then(loaded => setCities({ key, list: loaded }))
            .catch(() => setCities({ key, list: [] }));

        return () => controller.abort();
    }, [data.country, data.state, cityKey]);

    // Only the list that belongs to the current selection is offered; a list
    // left over from a previous country or state is ignored until it reloads.
    const stateOptions = useMemo(
        () => (states.country === data.country ? states.list : []),
        [states, data.country]
    );
    const cityOptions = useMemo(
        () => (cities.key === cityKey ? cities.list : []),
        [cities, cityKey]
    );

    // The option elements are built once per list rather than on every render.
    // There are over 200 countries, and some states have as many cities;
    // rebuilding them on each keystroke makes typing elsewhere feel laggy.
    const countryItems = useMemo(
        () => countries.map(country => (
            <MenuItem key={country.name} value={country.name}>{country.name}</MenuItem>
        )),
        [countries]
    );
    const stateItems = useMemo(
        () => stateOptions.map(state => (
            <MenuItem key={state.name} value={state.name}>{state.name}</MenuItem>
        )),
        [stateOptions]
    );
    const cityItems = useMemo(
        () => cityOptions.map(city => (
            <MenuItem key={city.name} value={city.name}>{city.name}</MenuItem>
        )),
        [cityOptions]
    );

    /**
     * Checks the organisation name and username once the visitor leaves the
     * field. The server rejects a clash on submit either way; catching it here
     * means they are told before they have filled in a password.
     */
    const runAvailabilityCheck = () => {
        if (!data.clientName.trim() && !data.userName.trim()) return;

        checkTrialAvailability(data.clientName, data.userName)
            .then(result => setNameTaken({
                client: result.clientNameTaken
                    ? `That name is taken.${result.clientNameSuggestion ? ` Try "${result.clientNameSuggestion}".` : ''}`
                    : '',
                user: result.userNameTaken
                    ? `That username is taken.${result.userNameSuggestion ? ` Try "${result.userNameSuggestion}".` : ''}`
                    : ''
            }))
            .catch(() => setNameTaken({ client: '', user: '' }));
    };

    const toggleModule = useCallback((moduleId: number) => {
        onModulesChange(
            moduleIds.includes(moduleId)
                ? moduleIds.filter(id => id !== moduleId)
                : [...moduleIds, moduleId]
        );
    }, [moduleIds, onModulesChange]);

    const allModulesSelected = modules.length > 0 && modules.every(module => moduleIds.includes(module.id));
    const someModulesSelected = !allModulesSelected && modules.some(module => moduleIds.includes(module.id));

    const toggleAllModules = () => {
        onModulesChange(allModulesSelected ? [] : modules.map(module => module.id));
    };

    // Rebuilt only when the modules or the selection change, so typing in a text
    // field does not re-render every checkbox.
    const moduleItems = useMemo(
        () => modules.map(module => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={module.id}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={moduleIds.includes(module.id)}
                            onChange={() => toggleModule(module.id)}
                            sx={{ color: selectedOrg.color, '&.Mui-checked': { color: selectedOrg.color } }}
                        />
                    }
                    label={module.name}
                />
            </Grid>
        )),
        [modules, moduleIds, selectedOrg.color, toggleModule]
    );

    const bind = (field: keyof TrialFormData) => ({
        value: data[field],
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange(field, event.target.value),
        error: !!errors[field],
        helperText: errors[field] ?? '',
        inputRef: (el: HTMLInputElement) => { if (el) fieldRefs.current[field] = el; }
    });

    return (
        <Fade in timeout={800}>
            <Box>
                {/* The site's theme rounds inputs, buttons and surfaces. The
                    trial form is squared off instead, so it reads as a data
                    entry screen rather than marketing copy. Scoped here rather
                    than in the theme, which the rest of the site shares. */}
                <Paper
                    sx={{
                        p: { xs: 3, md: 6 },
                        bgcolor: 'rgba(255,255,255,0.96)',
                        borderRadius: 0,
                        '& .MuiOutlinedInput-root': { borderRadius: 0 },
                        '& .MuiButton-root': { borderRadius: 0 },
                        '& .MuiAlert-root': { borderRadius: 0 },
                        '& .MuiChip-root': { borderRadius: 0 }
                    }}
                >
                    <Button
                        startIcon={<ArrowBack sx={{ ...(language !== 'English' && { transform: 'rotate(180deg)' }) }} />}
                        onClick={onBack}
                        sx={{ mb: 3 }}
                    >
                        {t('back')}
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                        <Typography variant="h2" color="primary" sx={{ fontWeight: 800 }}>
                            {t('start_your_free_trial')}
                        </Typography>
                        <Chip
                            label={selectedOrg.name}
                            sx={{ bgcolor: `${selectedOrg.color}15`, color: selectedOrg.color, fontWeight: 700 }}
                        />
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        {t('trial_form_intro')}
                    </Typography>

                    {/* The disclaimer sits above the fields, so nobody can fill the
                        form without having been told what they are signing up to. */}
                    <Alert
                        severity="info"
                        icon={<Schedule />}
                        sx={{
                            mt: 3, borderRadius: 0, alignItems: 'flex-start',
                            bgcolor: '#eef6e3', color: '#33491c',
                            border: '1px solid #cfe3b4',
                            '& .MuiAlert-icon': { color: '#6f963f' }
                        }}
                    >
                        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                            {t('trial_disclaimer_title', { days: String(TRIAL_DAYS) })}
                        </Typography>
                        <Typography variant="body2">
                            {t('trial_disclaimer_body', { days: String(TRIAL_DAYS), date: endsOn })}
                        </Typography>
                    </Alert>

                    {lookupError && (
                        <Alert severity="warning" sx={{ mt: 2, borderRadius: 0 }}>{lookupError}</Alert>
                    )}
                    {submitError && (
                        <Alert severity="error" sx={{ mt: 2, borderRadius: 0 }}>{submitError}</Alert>
                    )}

                    <Divider sx={{ my: 4 }} />

                    <SectionHeading
                        icon={<Business />}
                        title={t('organization_details')}
                        color={selectedOrg.color}
                    />

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                required
                                label={t('client_name')}
                                placeholder={t('client_name_placeholder')}
                                inputProps={{ maxLength: 100 }}
                                {...bind('clientName')}
                                onBlur={runAvailabilityCheck}
                                error={!!errors.clientName || !!nameTaken.client}
                                helperText={errors.clientName ?? nameTaken.client}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                required
                                label={t('campus_name')}
                                placeholder={t('campus_name_placeholder')}
                                inputProps={{ maxLength: 100 }}
                                {...bind('campusName')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                label={t('description')}
                                {...bind('description')}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 5 }}>
                        <SectionHeading
                            icon={<Person />}
                            title={t('contact_detail')}
                            color={selectedOrg.color}
                        />

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t('contact_person')}
                                    {...bind('contactPerson')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t('contact_no')}
                                    {...bind('contactNo')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    required
                                    type="email"
                                    label={t('email_address')}
                                    {...bind('email')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label={t('mobile')}
                                    {...bind('mobile')}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    required
                                    label={t('country')}
                                    value={countries.length ? data.country : ''}
                                    onChange={(event) => onChange('country', event.target.value)}
                                    disabled={!countries.length}
                                    error={!!errors.country}
                                    helperText={errors.country ?? (countries.length ? '' : t('lookup_unavailable'))}
                                >
                                    {countryItems}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    required
                                    label={t('state')}
                                    value={stateOptions.length ? data.state : ''}
                                    onChange={(event) => onChange('state', event.target.value)}
                                    disabled={!stateOptions.length}
                                    error={!!errors.state}
                                    helperText={errors.state ?? (data.country ? '' : t('select_country_first'))}
                                >
                                    {stateItems}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    required
                                    label={t('city')}
                                    value={cityOptions.length ? data.city : ''}
                                    onChange={(event) => onChange('city', event.target.value)}
                                    disabled={!cityOptions.length}
                                    error={!!errors.city}
                                    helperText={errors.city ?? (data.state ? '' : t('select_state_first'))}
                                >
                                    {cityItems}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    required
                                    multiline
                                    minRows={2}
                                    label={t('address')}
                                    {...bind('address')}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ mt: 5 }}>
                        <SectionHeading
                            icon={<Badge />}
                            title={t('your_login')}
                            color={selectedOrg.color}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: -2, mb: 3 }}>
                            {t('your_login_hint')}
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t('username')}
                                    inputProps={{ maxLength: 50, autoComplete: 'username' }}
                                    {...bind('userName')}
                                    onBlur={runAvailabilityCheck}
                                    error={!!errors.userName || !!nameTaken.user}
                                    helperText={errors.userName ?? nameTaken.user}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label={t('full_name')}
                                    {...bind('fullName')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    label={t('password')}
                                    {...bind('password')}
                                    InputProps={{
                                        autoComplete: 'new-password',
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(value => !value)}
                                                    edge="end"
                                                    aria-label={showPassword ? t('hide_password') : t('show_password')}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    label={t('confirm_password')}
                                    InputProps={{ autoComplete: 'new-password' }}
                                    {...bind('confirmPassword')}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ mt: 5 }}>
                        <SectionHeading
                            icon={<RocketLaunch />}
                            title={t('module_access')}
                            color={selectedOrg.color}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: -2, mb: 2 }}>
                            {t('module_access_hint')}
                        </Typography>

                        {modules.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                {t('modules_unavailable')}
                            </Typography>
                        ) : (
                            <>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={allModulesSelected}
                                            indeterminate={someModulesSelected}
                                            onChange={toggleAllModules}
                                            sx={{
                                                color: selectedOrg.color,
                                                '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: selectedOrg.color }
                                            }}
                                        />
                                    }
                                    label={t('select_all_modules')}
                                    sx={{ mb: 1, '& .MuiFormControlLabel-label': { fontWeight: 700 } }}
                                />
                                <Divider sx={{ mb: 1 }} />
                                <Grid container>
                                    {moduleItems}
                                </Grid>
                            </>
                        )}
                        {errors.clientName === undefined && moduleIds.length === 0 && modules.length > 0 && (
                            <Typography variant="caption" color="text.secondary">
                                {t('modules_none_selected')}
                            </Typography>
                        )}
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    <Box sx={{
                        display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2
                    }}>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
                            {t('trial_footer_note', { days: String(TRIAL_DAYS) })}
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            disabled={submitting}
                            startIcon={<CheckCircleOutline />}
                            onClick={() => onSubmit(modules)}
                            sx={{ px: 6, whiteSpace: 'nowrap' }}
                        >
                            {submitting ? t('creating_your_trial') : t('start_my_free_trial')}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
};

export default TrialSignupForm;
