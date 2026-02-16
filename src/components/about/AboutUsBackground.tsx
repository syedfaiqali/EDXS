import React, { useEffect, useState } from 'react';
import { Box, keyframes, Typography } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FunctionsIcon from '@mui/icons-material/Functions';
import CalculateIcon from '@mui/icons-material/Calculate';
import SchoolIcon from '@mui/icons-material/School';
import CreateIcon from '@mui/icons-material/Create';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import ScienceIcon from '@mui/icons-material/Science';
import PsychologyIcon from '@mui/icons-material/Psychology';

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-500px) rotate(180deg); }
  100% { transform: translateY(-1000px) rotate(360deg); }
`;

const drift = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(30px); }
`;

interface BackgroundItem {
    icon?: React.ReactElement<{ sx?: any }>;
    label?: string;
    size: number;
    left: number;
    delay: number;
    duration: number;
    color: string;
}

const AboutUsBackground: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [items, setItems] = useState<BackgroundItem[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 40,
                y: (e.clientY / window.innerHeight - 0.5) * 40,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Generate stable random items
        const pool = [
            { icon: <MenuBookIcon />, label: 'ABC' },
            { icon: <FunctionsIcon />, label: 'Σ' },
            { icon: <CalculateIcon />, label: '123' },
            { icon: <SchoolIcon />, label: 'EDXS' },
            { icon: <CreateIcon />, label: 'π' },
            { icon: <ArchitectureIcon />, label: '√' },
            { icon: <ScienceIcon />, label: 'H₂O' },
            { icon: <PsychologyIcon />, label: 'Logic' },
            { label: 'History' },
            { label: 'Arts' },
        ];

        const newItems = [...Array(30)].map((_, i) => ({
            ...pool[i % pool.length],
            size: Math.random() * 25 + 15,
            left: Math.random() * 100,
            delay: Math.random() * 20,
            duration: Math.random() * 20 + 20,
            color: i % 3 === 0 ? '#76a345' : (i % 3 === 1 ? '#f0dbb0' : '#1e293b'),
        }));
        setItems(newItems);

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 0.6,
                background: 'radial-gradient(circle at 50% 50%, rgba(240, 219, 176, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
            }}
        >
            {items.map((item, i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        left: `${item.left}%`,
                        bottom: -150,
                        animation: `${float} ${item.duration}s linear infinite`,
                        animationDelay: `${item.delay}s`,
                        transition: 'transform 0.5s ease-out',
                        transform: `translate(${mousePos.x * (item.size / 30)}px, ${mousePos.y * (item.size / 30)}px)`,
                        color: item.color,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                    }}
                >
                    <Box sx={{
                        animation: `${drift} ${item.duration * 0.5}s ease-in-out infinite`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        {item.icon && React.cloneElement(item.icon, {
                            sx: { fontSize: item.size, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }
                        })}
                        {item.label && (
                            <Typography
                                sx={{
                                    fontSize: item.size * 0.5 + 8,
                                    fontWeight: 800,
                                    opacity: 0.8,
                                    whiteSpace: 'nowrap',
                                    fontFamily: '"Outfit", sans-serif',
                                    letterSpacing: '0.05em',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                            >
                                {item.label}
                            </Typography>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default AboutUsBackground;
