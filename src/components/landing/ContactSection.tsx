import React from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    Divider,
    alpha
} from '@mui/material';

const ContactSection: React.FC = () => {
    return (
        <Box sx={{ bgcolor: 'secondary.main', py: { xs: 8, md: 12 } }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            color: 'primary.main',
                            fontSize: { xs: '2.5rem', md: '4rem' },
                            mb: 2
                        }}
                    >
                        Your satisfaction is our top priority
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '1.2rem',
                            color: 'primary.main',
                            opacity: 0.8,
                            fontWeight: 500
                        }}
                    >
                        We're just a message away, contact us for support.
                    </Typography>
                </Box>

                <Grid container spacing={8}>
                    {/* Left Side: Form */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Box>
                                <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'primary.main' }}>Name</Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Your Name"
                                    variant="outlined"
                                    sx={{ bgcolor: 'white', borderRadius: 1, '& fieldset': { border: 'none' } }}
                                />
                            </Box>

                            <Box>
                                <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'primary.main' }}>Email</Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Email"
                                    variant="outlined"
                                    sx={{ bgcolor: 'white', borderRadius: 1, '& fieldset': { border: 'none' } }}
                                />
                            </Box>

                            <Box>
                                <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'primary.main' }}>Contact Number</Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Contact Number with Country Code"
                                    variant="outlined"
                                    sx={{ bgcolor: 'white', borderRadius: 1, '& fieldset': { border: 'none' } }}
                                />
                            </Box>

                            <Box>
                                <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'primary.main' }}>Location</Typography>
                                <TextField
                                    fullWidth
                                    placeholder="City Name"
                                    variant="outlined"
                                    sx={{ bgcolor: 'white', borderRadius: 1, '& fieldset': { border: 'none' } }}
                                />
                            </Box>

                            <Box>
                                <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'primary.main' }}>Please Select Your Interest</Typography>
                                <Box sx={{
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: alpha('#76a345', 0.2)
                                }}>
                                    <RadioGroup defaultValue="resell">
                                        <FormControlLabel
                                            value="resell"
                                            control={<Radio sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
                                            label={<Typography sx={{ fontWeight: 500, color: 'primary.main' }}>I want to resell EDXS</Typography>}
                                        />
                                        <FormControlLabel
                                            value="partner"
                                            control={<Radio sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
                                            label={<Typography sx={{ fontWeight: 500, color: 'primary.main' }}>For become a partner</Typography>}
                                        />
                                    </RadioGroup>
                                </Box>
                            </Box>

                            <Box>
                                <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'primary.main' }}>Message</Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Your Message"
                                    variant="outlined"
                                    sx={{ bgcolor: 'white', borderRadius: 1, '& fieldset': { border: 'none' } }}
                                />
                            </Box>

                            {/* Captcha Placeholder */}
                            <Box sx={{
                                width: 300,
                                height: 80,
                                bgcolor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                px: 2,
                                gap: 2
                            }}>
                                <Box sx={{ width: 30, height: 30, border: '2px solid #ddd', borderRadius: 0.5 }} />
                                <Typography sx={{ fontSize: '0.9rem', color: '#555' }}>I'm not a robot</Typography>
                                <Box sx={{ ml: 'auto', textAlign: 'center' }}>
                                    <Typography sx={{ fontSize: '0.6rem', color: '#999' }}>reCAPTCHA</Typography>
                                    <Typography sx={{ fontSize: '0.5rem', color: '#999' }}>Privacy - Terms</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        flex: 1,
                                        py: 2,
                                        bgcolor: 'primary.dark',
                                        fontSize: '1.1rem',
                                        fontWeight: 900
                                    }}
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        flex: 1,
                                        py: 2,
                                        bgcolor: 'primary.dark',
                                        fontSize: '1.1rem',
                                        fontWeight: 900
                                    }}
                                >
                                    Go Back
                                </Button>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Side: Contact Details */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pl: { md: 8 } }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>Contact Details</Typography>
                                <Typography sx={{ color: 'primary.main', fontSize: '1.2rem', fontWeight: 700 }}>0322 3440909</Typography>
                                <Typography sx={{ color: 'primary.main', fontSize: '1.2rem', fontWeight: 700 }}>edxssystem@gmail.com</Typography>
                                <Divider sx={{ mt: 4, bgcolor: 'primary.main', height: 2 }} />
                            </Box>

                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>EDXS (Pakistan)</Typography>
                                <Typography sx={{ color: 'primary.main', lineHeight: 1.8 }}>
                                    <Box component="span" sx={{ fontWeight: 900 }}>Address:</Box> Office No,107, AL Amin Tower,Main NIPA Chowrangi Gulshan-e-Iqbal, Block 10, University Road, Karachi.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>EDXS (USA)</Typography>
                                <Typography sx={{ color: 'primary.main', lineHeight: 1.8 }}>
                                    <Box component="span" sx={{ fontWeight: 900 }}>Address:</Box> 5930 Lovers Lane, Third Floor, Portage, MI 49002 / USA.
                                </Typography>
                                <Divider sx={{ mt: 4, bgcolor: alpha('#76a345', 0.3), height: 1 }} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ContactSection;
