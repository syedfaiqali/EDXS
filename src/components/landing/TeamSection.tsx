import React, { useRef } from 'react';
import { Box, Typography, Container, Grid, keyframes, alpha } from '@mui/material';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';

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
    description: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
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
                bgcolor: dark ? 'primary.main' : 'white',
                py: { xs: 10, md: 15 },
                textAlign: 'center',
                borderBottom: `1px solid ${alpha(dark ? '#fff' : '#000', 0.05)}`
            }}
        >
            <Container maxWidth="xl">
                <Box sx={{ mb: 10 }}>
                    <Typography
                        variant="overline"
                        sx={{
                            fontWeight: 900,
                            letterSpacing: '0.4em',
                            color: dark ? alpha('#fff', 0.6) : alpha('#000', 0.5),
                            display: 'block',
                            mb: 2
                        }}
                    >
                        OUR EXPERTS
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            color: dark ? 'secondary.main' : 'primary.main',
                            fontSize: { xs: '2.5rem', md: '4rem' },
                            textTransform: 'none',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        {title}
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {members.map((member, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={member.name}>
                            <Box
                                sx={{
                                    opacity: isVisible ? 1 : 0,
                                    animation: isVisible ? `${cardFadeIn} 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards` : 'none',
                                    animationDelay: `${index * 0.1}s`,
                                    height: '100%',
                                    position: 'relative',
                                    borderRadius: 0, // Modern brutalist edge
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    '&:hover .member-overlay': {
                                        opacity: 1,
                                        transform: 'translateY(0)'
                                    },
                                    '&:hover .member-img': {
                                        transform: 'scale(1.1)',
                                        filter: 'grayscale(0.5) blur(2px)'
                                    },
                                    '&:hover .member-info-basic': {
                                        opacity: 0,
                                        transform: 'translateY(20px)'
                                    }
                                }}
                            >
                                {/* Image Container */}
                                <Box sx={{
                                    width: '100%',
                                    height: 450,
                                    bgcolor: '#f1f5f9',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <Box
                                        className="member-img"
                                        component="img"
                                        src={member.image}
                                        alt={member.name}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
                                        }}
                                    />

                                    {/* Minimal Quick Info (Visible by default) */}
                                    <Box
                                        className="member-info-basic"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            p: 3,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                            color: 'white',
                                            textAlign: 'left',
                                            transition: 'all 0.4s ease'
                                        }}
                                    >
                                        <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>{member.name}</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>
                                            {member.role}
                                        </Typography>
                                    </Box>

                                    {/* Hover Details Overlay */}
                                    <Box
                                        className="member-overlay"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            bgcolor: alpha(dark ? '#1e293b' : '#1e293b', 0.9),
                                            color: 'white',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: 4,
                                            opacity: 0,
                                            transform: 'translateY(20px)',
                                            transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                                            zIndex: 2
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 900,
                                                mb: 1,
                                                color: 'secondary.main'
                                            }}
                                        >
                                            {member.name}
                                        </Typography>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 3,
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                opacity: 0.7
                                            }}
                                        >
                                            {member.role}
                                        </Typography>

                                        <Box sx={{ width: 40, height: 2, bgcolor: 'secondary.main', mb: 3 }} />

                                        <Typography
                                            variant="body1"
                                            sx={{
                                                lineHeight: 1.6,
                                                mb: 4,
                                                fontSize: '1rem',
                                                fontStyle: 'italic',
                                                opacity: 0.9
                                            }}
                                        >
                                            "{member.description}"
                                        </Typography>

                                        {/* Social Icons */}
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            {[
                                                { Icon: LinkedInIcon, link: member.linkedin },
                                                { Icon: TwitterIcon, link: member.twitter },
                                                { Icon: EmailIcon, link: member.email ? `mailto:${member.email}` : undefined }
                                            ].filter(social => social.link).map(({ Icon, link }, idx) => (
                                                <Box
                                                    key={idx}
                                                    component="a"
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        p: 1,
                                                        borderRadius: '50%',
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                        color: 'white',
                                                        display: 'flex',
                                                        '&:hover': {
                                                            bgcolor: 'secondary.main',
                                                            color: 'primary.main',
                                                            borderColor: 'secondary.main'
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <Icon sx={{ fontSize: '1.2rem' }} />
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
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
        {
            name: 'Sohail Tareen',
            role: 'Founder & CEO',
            image: 'https://edu-man.com/img/Founder%20CEO.webp',
            description: 'Visionary leader with 20+ years of experience in educational transformation and digital strategy.',
            linkedin: 'https://www.linkedin.com/in/sohail-tareen-931b0b1b/'
        },
        {
            name: 'Shahbaz Ahmer',
            role: 'Chief Technical Officer',
            image: 'https://edu-man.com/img/CTO.webp',
            description: 'Architecting complex systems and leading technical innovations at the intersection of AI and Web3.',
            linkedin: 'https://www.linkedin.com/in/shahbazahmer/'
        },
        {
            name: 'Maham Tareen',
            role: 'Creative Director',
            image: 'https://edu-man.com/img/Creative%20director.webp',
            description: 'Award-winning designer focused on creating intuitive and emotionally resonant user experiences.'
        },
        {
            name: 'Wareesha Tareen',
            role: 'Operational Manager',
            image: 'https://edu-man.com/img/Wareesha.webp',
            description: 'Driving organizational excellence through strategic planning and meticulous operational oversight.'
        }
    ];

    const management = [
        {
            name: 'Bilal Mahmood',
            role: 'Project Manager',
            image: 'https://edu-man.com/img/PM.webp',
            description: 'Ensuring seamless project delivery across global teams with a focus on agile methodologies.'
        },
        {
            name: 'Syed Faiq Ali Jafri',
            role: 'Team Lead',
            image: faiqImage,
            description: 'Full-stack expert mentor guiding development teams toward technical perfection and innovation.',
            linkedin: 'https://www.linkedin.com/in/syedfaiqjafridev'
        },
        // {
        //     name: 'Adnan',
        //     role: 'Hospitality Lead',
        //     image: 'https://via.placeholder.com/400x600?text=Adnan',
        //     description: 'Fueling the creative process by maintaining the perfect workspace atmosphere and energy.',
        //     linkedin: 'https://www.linkedin.com/in/adnan-ahmed-4b0b1b1b/'
        // },
        // {
        //     name: 'Obaid Khan',
        //     role: 'Logistics Manager',
        //     image: 'https://via.placeholder.com/400x600?text=Obaid',
        //     description: 'Ensuring the team moves forward—literally—with precision logistics and on-time coordination.'
        // }
    ];

    const marketing = [
        {
            name: 'Affan Ahmed Khan',
            role: 'Implementation Lead',
            image: 'https://edu-man.com/img/Affan.webp',
            description: 'Expert in bridging the gap between digital products and real-world institutional success.',
            linkedin: 'https://www.linkedin.com/in/affan-ahmed-khan-1b6258220/'
        },
        {
            name: 'Kamran Bharday',
            role: 'Implementation Expert',
            image: 'https://edu-man.com/img/kamran.webp',
            description: 'Dedicated to optimizing system deployments and ensuring high-impact results for all clients.',
            linkedin: 'https://www.linkedin.com/in/kamranbharday/'
        },
        // {
        //     name: 'Miya Baji',
        //     role: 'Wellness Coordinator',
        //     image: 'https://edu-man.com/img/Mia Baji.webp',
        //     description: 'Championing work-life balance and psychological safety within our high-performance culture.'
        // },
        // {
        //     name: 'Johnny Bhayya',
        //     role: 'Team Support Expert',
        //     image: 'https://via.placeholder.com/400x600?text=Johnny+Bhayya',
        //     description: 'Providing critical infrastructure support and ensuring peak operational readiness across departments.'
        // },
    ];

    const devTeam1 = [
        {
            name: 'Syed Osama Zaidi',
            role: 'Senior Backend Developer',
            image: 'https://edu-man.com/img/Osama.webp',
            description: 'Master of scalable architectures and secure data processing pipelines.',
            linkedin: 'https://www.linkedin.com/in/osama-zaidi-4b0b1b1b/'
        },
        {
            name: 'Ashar Samad',
            role: 'Lead System Architect',
            image: asharImage,
            description: 'The technical backbone of our most complex enterprise-level integrations.',
            linkedin: 'https://www.linkedin.com/in/ashar-samad-863773194/'
        },
        {
            name: 'Abdullah Khan',
            role: 'Backend Developer',
            image: abdullahImage,
            description: 'Optimizing performance and building robust APIs that power our entire ecosystem.',
            linkedin: 'https://www.linkedin.com/in/abdullah-khan-4b0b1b1b/'
        },
        {
            name: 'Rao Raza',
            role: 'Backend Developer',
            image: raoImage,
            description: 'Focused on high-availability systems and modern cloud-native infrastructures.'
        }
    ];

    const devTeam2 = [
        // {
        //     name: 'Bilal Ahmed Sagir',
        //     role: 'Senior UI/UX Developer',
        //     image: 'https://edu-man.com/img/Bilal Ahmed Sagir.webp',
        //     description: 'Crafting pixel-perfect interfaces that blend aesthetic beauty with functional power.'
        // },
        {
            name: 'Ghufran Ali',
            role: 'Senior Frontend Developer',
            image: ghufranImage,
            description: 'Expert in React ecosystem and creating high-performance interactive web applications.',
            linkedin: 'https://www.linkedin.com/in/ghufran-ali-082570175/'
        },
        {
            name: 'Amin Lakhani',
            role: 'AI Research Engineer',
            image: aminImage,
            description: 'Pioneering our intelligent features through deep learning and predictive analytics.',
            linkedin: 'https://www.linkedin.com/in/amin-lakhani-4b38a4223/'
        },
        {
            name: 'Syed Faraz Ali',
            role: 'Most Senior UI Expert',
            image: farazImage,
            description: 'The final word on UI quality and frontend architectural standards across all platforms.',
            linkedin: 'https://www.linkedin.com/in/syed-faraz-ali-704b23384/'
        }
    ];

    return (
        <Box>
            <TeamGroup title="Executive Leadership" members={executives} />
            <TeamGroup title="Operations & Management" members={management} dark />
            <TeamGroup title="Strategic Implementation" members={marketing} />
            <TeamGroup title="Infrastructure & Core" members={devTeam1} dark />
            <TeamGroup title="Interactive & AI" members={devTeam2} />

            {/* Bottom Quote Banner */}
            <Box
                sx={{
                    position: 'relative',
                    py: { xs: 15, md: 25 },
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
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            lineHeight: 1.4,
                            color: 'secondary.main',
                            fontStyle: 'italic',
                            mb: 4,
                            fontSize: { xs: '1.5rem', md: '2.5rem' }
                        }}
                    >
                        "Everyone at EDXS is here for the same reason: we see it as our duty to improve the user experience of the world."
                    </Typography>
                    <Typography sx={{ opacity: 0.6, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
                        Impact over everything.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default TeamSection;
