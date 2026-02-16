import React, { useRef } from 'react';
import { Box, Typography, Container, Grid, keyframes, alpha } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import abdullahImage from '../../assets/abdullah.webp';
import ghufranImage from '../../assets/ghufran.webp';
import aminImage from '../../assets/amin.webp';
import farazImage from '../../assets/faraz.webp';
import asharImage from '../../assets/ashar.webp';
import faiqImage from '../../assets/faiq.webp';
import raoImage from '../../assets/rao.webp';

// Animation for cards
const cardFadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface TeamMember {
    name: string;
    role: string;
    image: string;
}

interface TeamSectionProps {
    title: string;
    members: TeamMember[];
    dark?: boolean;
}

const TeamGroup: React.FC<TeamSectionProps> = ({ title, members, dark }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

    return (
        <Box
            ref={sectionRef}
            sx={{
                bgcolor: dark ? 'primary.main' : 'secondary.main',
                py: { xs: 8, md: 12 },
                textAlign: 'center'
            }}
        >
            <Container maxWidth="xl">
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 900,
                        mb: 8,
                        color: dark ? 'secondary.main' : 'primary.main',
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        textTransform: 'none'
                    }}
                >
                    {title}
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {members.map((member, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={member.name}>
                            <Box
                                sx={{
                                    opacity: isVisible ? 1 : 0,
                                    animation: isVisible ? `${cardFadeIn} 0.6s ease-out forwards` : 'none',
                                    animationDelay: `${index * 0.1}s`,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-10px)'
                                    }
                                }}
                            >
                                {/* Image Container */}
                                <Box sx={{
                                    width: '100%',
                                    height: 400,
                                    bgcolor: dark ? alpha('#fff', 0.1) : alpha('#000', 0.05),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <Box
                                        component="img"
                                        src={member.image}
                                        alt={member.name}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </Box>

                                {/* Info Block */}
                                <Box
                                    sx={{
                                        p: 3,
                                        bgcolor: dark ? 'secondary.main' : 'primary.main',
                                        color: dark ? 'primary.main' : 'white',
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        minHeight: 120
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 700,
                                            opacity: 0.9,
                                            mb: 1,
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {member.role}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 900,
                                            fontSize: '1.4rem'
                                        }}
                                    >
                                        {member.name}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

const TeamSection: React.FC = () => {
    const executives = [
        { name: 'Sohail Tareen', role: 'Founder & CEO', image: 'https://edu-man.com/img/Founder%20CEO.webp' },
        { name: 'Shahbaz Ahmer', role: 'Chief Technical Officer', image: 'https://edu-man.com/img/CTO.webp' },
        { name: 'Maham Tareen', role: 'Creative Director', image: 'https://edu-man.com/img/Creative%20director.webp' },
        { name: 'Wareesha Tareen', role: 'Operational Manager', image: 'https://edu-man.com/img/Wareesha.webp' }
    ];

    const management = [
        { name: 'Bilal Mahmood', role: 'Project Manager', image: 'https://edu-man.com/img/PM.webp' },
        { name: 'Syed Faiq Ali Jafri', role: 'Team Lead', image: faiqImage },
        { name: 'Adnan', role: 'Tea Making Manager', image: 'https://via.placeholder.com/400x600?text=Saqib+Mushir' },
        { name: 'Obaid Khan', role: 'Car Driving Manager', image: 'https://via.placeholder.com/400x600?text=Syed+Raza+Abbas' }
    ];

    const marketing = [
        { name: 'Affan Ahmed Khan', role: 'Implementation Lead', image: 'https://edu-man.com/img/Affan.webp' },
        { name: 'Kamran Bharday', role: 'Implementation Expert', image: 'https://edu-man.com/img/kamran.webp' },
        { name: 'Miya Baji', role: 'Female Relaxation Provider', image: 'https://edu-man.com/img/Mia Baji.webp' },
        { name: 'Johnny Bhayya', role: 'Male Relaxation Provider', image: 'https://via.placeholder.com/400x600?text=Johnny+Bhayya' },
    ];

    const frontEndDevelopmentTeam = [
        { name: 'Syed Osama Zaidi', role: 'Senior Backend Developer', image: 'https://edu-man.com/img/Osama.webp' },
        { name: 'Abdullah Khan', role: 'Backend Developer', image: abdullahImage },
        { name: 'Ashar Samad', role: 'Most Senior Backend Developer', image: asharImage },
        { name: 'Rao Raza', role: 'Backend Developer', image: raoImage }
    ];

    const backEndDevelopmentTeam = [
        { name: 'Bilal Ahmed Sagir', role: 'Senior Frontend Developer', image: 'https://edu-man.com/img/Bilal Ahmed Sagir.webp' },
        { name: 'Ghufran Ali', role: 'Senior Frontend Developer', image: ghufranImage },
        { name: 'Amin Lakhani', role: 'AI Developer', image: aminImage },
        { name: 'Syed Faraz Ali', role: 'Most Senior Frontend Developer', image: farazImage }
    ];

    return (
        <Box>
            <TeamGroup title="Meet Our Executives" members={executives} />
            <TeamGroup title="Management Cadre" members={management} dark />
            <TeamGroup title="Marketing / Implementation Team" members={marketing} />
            <TeamGroup title="Development Team" members={backEndDevelopmentTeam} dark />
            <TeamGroup title="Development Team" members={frontEndDevelopmentTeam} dark />

            {/* Bottom Quote Banner */}
            <Box
                sx={{
                    position: 'relative',
                    py: 15,
                    bgcolor: '#1e293b',
                    color: 'white',
                    textAlign: 'center',
                    overflow: 'hidden'
                }}
            >
                {/* Background Text Overlay */}
                <Typography
                    variant="h1"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: { xs: '8rem', md: '15rem' },
                        fontWeight: 900,
                        opacity: 0.05,
                        whiteSpace: 'nowrap',
                        zIndex: 0,
                        pointerEvents: 'none',
                        letterSpacing: '0.1em'
                    }}
                >
                    EDXS TEAM
                </Typography>

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            lineHeight: 1.6,
                            color: 'secondary.main',
                            fontStyle: 'italic'
                        }}
                    >
                        "Everyone at EDXS for the same reason: we see it as our duty to improve the user experience of the world by guiding clients through impactful digital transformations."
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default TeamSection;
