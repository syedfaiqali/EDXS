import React, { useState } from 'react';
import { Box } from '@mui/material';
import { PhoneInTalk, WhatsApp } from '@mui/icons-material';

const ContactShortcuts: React.FC = () => {
    const phoneNumber = '+92 322 3440909';
    const [activeAction, setActiveAction] = useState<string | null>(null);

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
                width: 52,
                height: 116,
            }}
        >
            {actions.map((action, index) => (
                <Box
                    key={action.href}
                    component="a"
                    href={action.href}
                    target={action.external ? '_blank' : undefined}
                    rel={action.external ? 'noopener noreferrer' : undefined}
                    aria-label={`${action.label}: ${phoneNumber}`}
                    title={`${action.label}: ${phoneNumber}`}
                    data-expanded={activeAction === action.href}
                    onMouseEnter={() => setActiveAction(action.href)}
                    onMouseLeave={() => setActiveAction(null)}
                    onFocus={() => setActiveAction(action.href)}
                    onBlur={() => setActiveAction(null)}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        bottom: index === 0 ? 64 : 0,
                        width: 52,
                        height: 52,
                        minHeight: 52,
                        px: 0,
                        borderRadius: '999px',
                        bgcolor: action.color,
                        color: 'white',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.25,
                        overflow: 'hidden',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        boxShadow: '0 8px 22px rgba(69, 103, 42, 0.2)',
                        transition: 'width 260ms cubic-bezier(0.22, 1, 0.36, 1), padding 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease, transform 260ms ease',
                        '& .contact-shortcut-label': {
                            maxWidth: 0,
                            opacity: 0,
                            overflow: 'hidden',
                            transform: 'translateX(8px)',
                            whiteSpace: 'nowrap',
                            transition: 'max-width 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                        },
                        '&[data-expanded="true"]': {
                            width: { xs: 52, sm: 210 },
                            px: { xs: 0, sm: 2 },
                            justifyContent: { xs: 'center', sm: 'flex-start' },
                            transform: 'translateY(-3px)',
                            boxShadow: '0 13px 28px rgba(69, 103, 42, 0.3)',
                        },
                        '&[data-expanded="true"] .contact-shortcut-label': {
                            maxWidth: 145,
                            opacity: 1,
                            transform: 'translateX(0)',
                        },
                        '@media (prefers-reduced-motion: reduce)': {
                            transition: 'none',
                        },
                    }}
                >
                    {action.icon}
                    <Box component="span" className="contact-shortcut-label">
                        {action.label}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default ContactShortcuts;
