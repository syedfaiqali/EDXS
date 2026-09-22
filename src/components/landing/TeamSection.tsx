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
import omairImage from '../../assets/omair.webp';
import sohailImage from '../../assets/Sohail Tareen.webp';
import shahbazImage from '../../assets/ShahbazAhmer.webp';
import wareeshaImage from '../../assets/wareesha.webp';
import mahamImage from '../../assets/maham.webp';
import bilalImage from '../../assets/bilal.webp';
import affanImage from '../../assets/affan.webp';
import kamranImage from '../../assets/kamran.webp';
import osamaImage from '../../assets/osama.webp';
import asherImage from '../../assets/asher.webp';
import rizwanImage from '../../assets/rizwan.webp';

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
                                    borderRadius: 0.5,
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
            image: sohailImage,
            description: 'Leads EDXS with a clear vision for practical, technology-led education management.',
            linkedin: 'https://www.linkedin.com/in/sohail-tareen-931b0b1b/'
        },
        {
            name: 'Shahbaz Ahmer',
            role: 'Chief Technical Officer',
            image: shahbazImage,
            description: 'Guides the technology strategy behind reliable, scalable EDXS solutions.',
            linkedin: 'https://www.linkedin.com/in/shahbazahmer/'
        },
        {
            name: 'Maham Tareen',
            role: 'Creative Director',
            image: mahamImage,
            description: 'Shapes clear, thoughtful experiences that make EDXS easy for every user to navigate.'
        },
        {
            name: 'Wareesha Tareen',
            role: 'Operational Manager',
            image: wareeshaImage,
            description: 'Keeps operational planning aligned, organised, and focused on client success.'
        }
    ];

    const management = [
        {
            name: 'Bilal Mahmood',
            role: 'Project Manager',
            image: bilalImage,
            description: 'Coordinates projects from planning to delivery with a focus on clear outcomes.',
            linkedin: 'https://www.linkedin.com/in/bilal-mahmood-4a740690/'
        },
        {
            name: 'Syed Faiq Ali Jafri',
            role: 'Team Lead',
            image: faiqImage,
            description: 'Leads development work with a hands-on focus on quality and dependable delivery.',
            linkedin: 'https://www.linkedin.com/in/syedfaiqjafridev'
        },
        {
            name: 'Muhammad Rizwan Badar',
            role: 'Chief Technical Officer',
            image: rizwanImage,
            description: 'Supports technical operations and keeps core systems ready for day-to-day use.'
        },
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
            role: 'Devops & Cloud Specialist',
            image: affanImage,
            description: 'Builds and maintains cloud infrastructure that keeps EDXS dependable and secure.',
            linkedin: 'https://www.linkedin.com/in/affan-ahmed-khan-1b6258220/'
        },
        {
            name: 'Kamran Bharday',
            role: 'Implementation Expert',
            image: kamranImage,
            description: 'Works closely with clients to make system deployment smooth, effective, and practical.',
            linkedin: 'https://www.linkedin.com/in/muhammad-owais-b7135823a/'
        },
        {
            name: 'Muhammad Asher',
            role: 'Junior QA Specialist',
            image: asherImage,
            description: 'Supports quality assurance through careful testing and detail-oriented review.'
        },
    ];

    const devTeam1 = [
        {
            name: 'Syed Osama Zaidi',
            role: 'Senior Backend Developer',
            image: osamaImage,
            description: 'Builds dependable backend services that support EDXS at scale.',
            linkedin: 'https://www.linkedin.com/in/osama-zaidi-4b0b1b1b/'
        },
        {
            name: 'Ashar Samad',
            role: 'Lead System Architect',
            image: asharImage,
            description: 'Designs the system architecture behind robust EDXS integrations.',
            linkedin: 'https://www.linkedin.com/in/ashar-samad-863773194/'
        },
        {
            name: 'Abdullah Khan',
            role: 'Backend Developer',
            image: abdullahImage,
            description: 'Develops reliable APIs and backend features that power the EDXS platform.',
            linkedin: 'https://www.linkedin.com/in/abdullah-khan-57a278213/'
        },
        {
            name: 'Rao Raza',
            role: 'Backend Developer',
            image: raoImage,
            description: 'Focuses on resilient backend systems and consistent platform performance.'
        }
    ];

    const devTeam2 = [
        {
            name: 'Omair Nadiawala',
            role: 'Senior IOS Developer',
            image: omairImage,
            description: 'Builds polished mobile experiences that keep EDXS useful wherever teams work.',
            linkedin: 'https://www.linkedin.com/in/omairnadiadwala/'
        },
        {
            name: 'Ghufran Ali',
            role: 'Senior Software Developer',
            image: ghufranImage,
            description: 'Creates responsive, high-performance web experiences across the EDXS platform.',
            linkedin: 'https://www.linkedin.com/in/ghufran-ali-082570175/'
        },
        {
            name: 'Amin Lakhani',
            role: 'Senior Software Developer',
            image: aminImage,
            description: 'Contributes to intelligent, data-focused features that make EDXS more useful.',
            linkedin: 'https://www.linkedin.com/in/amin-lakhani-4b38a4223/'
        },
        {
            name: 'Syed Faraz Ali',
            role: 'Principle Software Developer',
            image: farazImage,
            description: 'Maintains strong frontend standards for a consistent, intuitive EDXS experience.',
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
