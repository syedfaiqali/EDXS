import { Box, Typography, Grid, keyframes } from '@mui/material';

const reveal = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HowItWorks: React.FC = () => {
    const titleText = "How EDXS Actually takes the Strain";
    const bodyText = "We seamlessly integrate into your school's workflow, allowing you to offload the burdensome tasks that consume your time and energy. Say goodbye to manual paperwork and administrative headaches – EDXS automates processes such as student enrollment, attendance tracking, and financial management, freeing you to focus on what truly matters: providing quality education. Our intuitive interface and customizable features make navigating the system a breeze, empowering you to streamline operations with ease. And with our dedicated support team by your side, assistance is just a click away whenever you need it. EDXS takes the strain out of school management so you can devote your energy to shaping young minds and fostering a thriving learning environment.";
    const footerText = "Let EDXS take the strain";

    return (
        <Box sx={{ bgcolor: '#edd8b4', pt: 5, pb: 15, px: '6%', borderTop: 'none', color: '#76a345', position: 'relative', zIndex: 1 }}>
            <Grid container spacing={8} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4" fontWeight="800" gutterBottom>
                        {titleText.split('').map((char, i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    opacity: 0,
                                    animation: `${reveal} 0.5s ease forwards`,
                                    animationDelay: `${i * 0.03}s`
                                }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </Box>
                        ))}
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', opacity: 0.9 }}>
                        {bodyText.split(' ').map((word, i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    opacity: 0,
                                    animation: `${reveal} 0.5s ease forwards`,
                                    animationDelay: `${(titleText.length * 0.03) + (i * 0.02)}s`,
                                    mr: '0.25em'
                                }}
                            >
                                {word}
                            </Box>
                        ))}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Box
                        component="video"
                        src="https://edu-man.com/vid/hand-shake-eduman.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        sx={{
                            width: '100%',
                            maxWidth: 500,
                            height: 'auto',
                            mb: 2,
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                        }}
                    />
                    <Typography variant="h4" fontWeight="800" sx={{ mt: 2, color: '#1a4163', textAlign: 'center' }}>
                        {footerText.split('').map((char, i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    opacity: 0,
                                    animation: `${reveal} 0.5s ease forwards`,
                                    animationDelay: `${(titleText.length * 0.03) + (bodyText.split(' ').length * 0.02) + (i * 0.05)}s`
                                }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </Box>
                        ))}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HowItWorks;
