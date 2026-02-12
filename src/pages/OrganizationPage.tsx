import React from 'react';
import { Box, Container, Typography, Button, Paper, Grid, TextField, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { clearSelection } from '../store/selectionSlice';
import { CheckCircleOutline, Group, Settings, Description } from '@mui/icons-material';

const OrganizationPage: React.FC = () => {
    const selection = useSelector((state: RootState) => state.selection);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (!selection.type) {
        navigate('/');
        return null;
    }

    const handleDone = () => {
        alert('Configuration Complete!');
        dispatch(clearSelection());
        navigate('/');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h2" gutterBottom align="center" color="primary" sx={{ mb: 6 }}>
                {selection.name} Organization Setup
            </Typography>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 4, height: '100%', borderTop: '4px solid #76a345' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Settings color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h3">Core Settings</Typography>
                        </Box>
                        <Stack spacing={3}>
                            <TextField fullWidth label="Institution Name" defaultValue={selection.name} />
                            <TextField fullWidth label="Code" placeholder="EB-2024" />
                            <TextField fullWidth select label="Fiscal Year" defaultValue="2024-25">
                                <MenuItem value="2023-24">2023-24</MenuItem>
                                <MenuItem value="2024-25">2024-25</MenuItem>
                            </TextField>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 4, height: '100%', borderTop: '4px solid #76a345' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Group color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h3">Visibility</Typography>
                        </Box>
                        <Stack spacing={1}>
                            {['Academics', 'Admission', 'Human Resource', 'Fee Management', 'Dashboard'].map((module) => (
                                <FormControlLabel
                                    key={module}
                                    control={<Switch defaultChecked color="primary" />}
                                    label={module}
                                />
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 4, height: '100%', borderTop: '4px solid #76a345' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Description color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h3">Logo & Branding</Typography>
                        </Box>
                        <Box
                            sx={{
                                border: '2px dashed rgba(0,0,0,0.1)',
                                borderRadius: 2,
                                p: 4,
                                textAlign: 'center',
                                backgroundColor: 'rgba(0,0,0,0.02)'
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Drag and drop your logo here or click to browse
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<CheckCircleOutline />}
                    sx={{ px: 8, py: 2, fontSize: '1.2rem' }}
                    onClick={handleDone}
                >
                    Done
                </Button>
            </Box>
        </Container>
    );
};

// Helper component for Stack if not imported correctly or if using custom
const Stack = ({ children, spacing = 2 }: { children: React.ReactNode, spacing?: number }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
        {children}
    </Box>
)

export default OrganizationPage;
