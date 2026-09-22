import React from 'react';
import { Box, keyframes } from '@mui/material';
import { PhoneInTalk, WhatsApp } from '@mui/icons-material';

const contactPulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 8px 22px rgba(69, 103, 42, 0.2); }
  50% { transform: scale(1.06); box-shadow: 0 12px 30px rgba(69, 103, 42, 0.36); }
`;

const ContactShortcuts: React.FC = () => {
    const phoneNumber = '+92 322 3440909';

    const actions = [
        {
            label: 'WhatsApp',
            href: 'https://wa.me/923223440909',
            icon: <WhatsApp fontSize="small" />,
            color: '#25D366',
            external: true,
        },
        {
            label: phoneNumber,
            href: 'tel:+923223440909',
            icon: <PhoneInTalk fontSize="small" />,
            color: '#6f963f',
            external: false,
        },
    ];

    return (
        <Box
            sx={{
                position: 'fixed',
                right: { xs: 16, md: 32 },
                bottom: { xs: 104, md: 108 },
                zIndex: 9998,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
            }}
        >
            {actions.map((action) => (
                <Box
                    key={action.href}
                    component="a"
                    href={action.href}
                    target={action.external ? '_blank' : undefined}
                    rel={action.external ? 'noopener noreferrer' : undefined}
                    aria-label={`${action.label}: ${phoneNumber}`}
                    title={`${action.label}: ${phoneNumber}`}
                    sx={{
                        minHeight: 46,
                        px: 1.5,
                        borderRadius: '999px',
                        bgcolor: action.color,
                        color: 'white',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        textDecoration: 'none',
                        fontSize: { xs: '0.72rem', md: '0.8rem' },
                        fontWeight: 800,
                        boxShadow: '0 8px 22px rgba(69, 103, 42, 0.2)',
                        animation: `${contactPulse} 1.8s ease-in-out infinite`,
                        '&:hover': {
                            animationPlayState: 'paused',
                            transform: 'translateY(-3px) scale(1.04)',
                        },
                        '@media (prefers-reduced-motion: reduce)': {
                            animation: 'none',
                            transition: 'none',
                        },
                    }}
                >
                    {action.icon}
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        {action.label}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default ContactShortcuts;
