import React from 'react';
import { Box, Container, Typography, Button, Paper, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const InfoPage: React.FC = () => {
    const selection = useSelector((state: RootState) => state.selection);
    const navigate = useNavigate();

    if (!selection.type) {
        navigate('/');
        return null;
    }

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={{ mb: 4 }}
            >
                Back to Selection
            </Button>

            <Paper sx={{ p: 6, borderRadius: 4 }}>
                <Typography variant="h2" gutterBottom color="primary">
                    {selection.name} Information
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                    {selection.description}
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h3" gutterBottom>
                    Key Features
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                    <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                        Streamlined administrative operations tailored for {selection.name}s.
                    </Typography>
                    <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                        Comprehensive student performance tracking and analytics.
                    </Typography>
                    <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                        Integrated communication hub for parents, students, and staff.
                    </Typography>
                    <Typography component="li" variant="body1">
                        Secure and scalable cloud-based infrastructure.
                    </Typography>
                </Box>

                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate('/organization')}
                    >
                        Next
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default InfoPage;
