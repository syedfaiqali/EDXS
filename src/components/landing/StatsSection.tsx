import { Box, Typography, Grid, keyframes } from '@mui/material';
import { Star, Language, Groups, DesktopWindows } from '@mui/icons-material';

const rotateY = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

const starSpecial = keyframes`
  0% { transform: translateX(0) rotate(-10deg); color: #f0dbb0; fill: currentColor; filter: none; }
  25% { transform: translateX(-35px) rotate(-30deg); color: #fff; fill: none; stroke: currentColor; stroke-width: 2px; filter: drop-shadow(0 0 8px rgba(255,255,255,0.6)); }
  50% { transform: translateX(0) rotate(-10deg); color: #f0dbb0; fill: currentColor; stroke: none; filter: none; }
  75% { transform: translateX(35px) rotate(10deg); color: #76a345; fill: none; stroke: currentColor; stroke-width: 2px; filter: drop-shadow(0 0 8px rgba(118,163,69,0.6)); }
  100% { transform: translateX(0) rotate(-10deg); color: #f0dbb0; fill: currentColor; filter: none; }
`;

const StatsSection: React.FC = () => {
    const stats = [
        { val: '200+', label: 'Schools and Groups', icon: <DesktopWindows sx={{ fontSize: '2.5rem' }} /> },
        { val: '7', label: 'Our Global Presence', icon: <Language sx={{ fontSize: '2.5rem' }} /> },
        { val: '1.4M', label: 'Students Profiles', icon: <Groups sx={{ fontSize: '2.5rem' }} /> },
        {
            val: '7+',
            label: 'Years of Refinement',
            icon: <Star sx={{
                fontSize: '2.5rem',
                animation: `${starSpecial} 5s ease-in-out infinite`,
            }} />
        }
    ];

    return (
        <Box sx={{ bgcolor: 'transparent', py: 8 }}>
            <Grid container spacing={0} justifyContent="center" alignItems="center">
                {stats.map((stat, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i} sx={{
                        textAlign: 'center',
                        color: 'white',
                        px: 4,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: { xs: 4, md: 0 }
                    }}>
                        {/* Vertical Separator */}
                        {i > 0 && (
                            <Box sx={{
                                position: 'absolute',
                                left: 0,
                                top: '10%',
                                bottom: '10%',
                                width: '1px',
                                bgcolor: 'rgba(255,255,255,0.3)',
                                display: { xs: 'none', md: 'block' }
                            }} />
                        )}

                        <Box sx={{
                            color: '#f0dbb0',
                            mb: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            animation: stat.label === 'Years of Refinement' ? 'none' : `${rotateY} 6s linear infinite`,
                            perspective: '1000px'
                        }}>
                            {stat.icon}
                        </Box>

                        <Typography variant="h3" sx={{
                            mb: 0.5,
                            color: '#f0dbb0',
                            fontWeight: 700,
                            fontSize: { xs: '2rem', md: '2.8rem' }
                        }}>
                            {stat.val}
                        </Typography>

                        <Typography variant="body2" sx={{
                            color: 'white',
                            opacity: 0.9,
                            fontWeight: 400,
                            fontSize: '0.9rem',
                            letterSpacing: 0.5,
                            mt: 1
                        }}>
                            {stat.label}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default StatsSection;
