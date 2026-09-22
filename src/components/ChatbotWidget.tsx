import React, { useState } from 'react';
import {
    Avatar,
    Box,
    Drawer,
    Fab,
    IconButton,
    TextField,
    Tooltip,
    Typography,
    keyframes,
} from '@mui/material';
import {
    AutoAwesome,
    Close,
    DeleteOutline,
    Send,
    SmartToy,
} from '@mui/icons-material';

type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    text: string;
};

const assistantPulse = keyframes`
  0%, 100% { box-shadow: 0 10px 26px rgba(69, 103, 42, 0.26), 0 0 0 0 rgba(111, 150, 63, 0.35); }
  50% { box-shadow: 0 14px 32px rgba(69, 103, 42, 0.34), 0 0 0 11px rgba(111, 150, 63, 0); }
`;

const apiBaseUrl = ((import.meta as { env?: Record<string, string> }).env?.VITE_API_BASE_URL
    ?? 'http://demo.kcompute.com:8063').replace(/\/$/, '');
const chatbotEndpoint = import.meta.env.DEV
    ? '/api/auth/chatbot/chat'
    : `${apiBaseUrl}/api/auth/chatbot/chat`;

const createWelcomeMessage = (): ChatMessage => ({
    id: 'welcome',
    role: 'assistant',
    text: 'Hi! I’m the EDXS AI Assistant. Ask me about our school management platform, admissions, products, or services.',
});

const ChatbotWidget: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || isSending) return;

        const userMessage: ChatMessage = { id: `${Date.now()}-user`, role: 'user', text };
        const history = messages.slice(-6).map((message) => ({
            role: message.role === 'assistant' ? 'assistant' : 'user',
            text: message.text,
        }));

        setMessages((current) => [...current, userMessage]);
        setInput('');
        setIsSending(true);

        try {
            const response = await fetch(chatbotEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history }),
            });
            const body = await response.json().catch(() => null) as { reply?: string; message?: string } | null;

            if (!response.ok) {
                throw new Error(body?.message || 'The AI assistant is temporarily unavailable.');
            }

            setMessages((current) => [...current, {
                id: `${Date.now()}-assistant`,
                role: 'assistant',
                text: body?.reply || 'I could not generate a response. Please try again.',
            }]);
        } catch (error) {
            setMessages((current) => [...current, {
                id: `${Date.now()}-error`,
                role: 'assistant',
                text: error instanceof Error ? error.message : 'Unable to contact the AI assistant. Please try again shortly.',
            }]);
        } finally {
            setIsSending(false);
        }
    };

    const clearChat = () => {
        setMessages([createWelcomeMessage()]);
        setInput('');
    };

    return (
        <>
            <Tooltip title="Chat with EDXS AI" placement="left">
                <Fab
                    aria-label="Open EDXS AI Assistant"
                    onClick={() => setOpen(true)}
                    sx={{
                        position: 'fixed',
                        right: { xs: 16, md: 32 },
                        bottom: { xs: 228, md: 238 },
                        zIndex: 10000,
                        width: 58,
                        height: 58,
                        bgcolor: 'primary.main',
                        color: 'white',
                        animation: `${assistantPulse} 2.2s ease-in-out infinite`,
                        '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-3px) scale(1.04)' },
                        '@media (prefers-reduced-motion: reduce)': { animation: 'none', transition: 'none' },
                    }}
                >
                    <AutoAwesome />
                </Fab>
            </Tooltip>

            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                sx={{ zIndex: 10001 }}
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: '100%', sm: 390 },
                            maxWidth: '100%',
                            borderTopLeftRadius: { xs: 0, sm: 24 },
                            borderBottomLeftRadius: { xs: 0, sm: 24 },
                            overflow: 'hidden',
                            boxShadow: '-16px 0 44px rgba(24,35,52,0.16)',
                        },
                    },
                }}
            >
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f5f7ef' }}>
                    <Box
                        sx={{
                            px: 2.25,
                            py: 1.75,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            color: 'white',
                            background: 'linear-gradient(135deg, #45672a 0%, #76a345 100%)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                            <Avatar sx={{ width: 38, height: 38, bgcolor: 'rgba(255,255,255,0.18)' }}>
                                <SmartToy />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 800, lineHeight: 1.15 }}>EDXS AI Assistant</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.86 }}>Here to help you explore EDXS</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Tooltip title="Clear conversation">
                                <IconButton aria-label="Clear conversation" onClick={clearChat} sx={{ color: 'white' }}>
                                    <DeleteOutline fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <IconButton aria-label="Close AI Assistant" onClick={() => setOpen(false)} sx={{ color: 'white' }}>
                                <Close />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {messages.map((message) => (
                            <Box
                                key={message.id}
                                sx={{
                                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '88%',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    gap: 0.75,
                                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                                }}
                            >
                                <Avatar sx={{ width: 28, height: 28, bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main', color: message.role === 'user' ? 'white' : 'primary.dark' }}>
                                    {message.role === 'user' ? <Typography sx={{ fontSize: '0.72rem', fontWeight: 800 }}>You</Typography> : <SmartToy sx={{ fontSize: '1rem' }} />}
                                </Avatar>
                                <Box
                                    sx={{
                                        px: 1.5,
                                        py: 1.15,
                                        borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                        bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                                        color: message.role === 'user' ? 'white' : 'text.primary',
                                        border: message.role === 'user' ? 'none' : '1px solid #dfe7d4',
                                        boxShadow: '0 5px 14px rgba(24,35,52,0.05)',
                                    }}
                                >
                                    <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.55, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                                        {message.text}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                        {isSending && (
                            <Box sx={{ alignSelf: 'flex-start', px: 1.5, py: 1, bgcolor: 'white', border: '1px solid #dfe7d4', borderRadius: '16px 16px 16px 4px' }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>EDXS AI is thinking…</Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ p: 1.5, bgcolor: 'white', borderTop: '1px solid #dfe7d4', display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            value={input}
                            disabled={isSending}
                            placeholder="Ask anything about EDXS…"
                            onChange={(event) => setInput(event.target.value.slice(0, 2000))}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    event.preventDefault();
                                    void sendMessage();
                                }
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f6f8f1' } }}
                        />
                        <IconButton
                            aria-label="Send message"
                            onClick={() => void sendMessage()}
                            disabled={!input.trim() || isSending}
                            sx={{
                                width: 44,
                                height: 44,
                                mb: 0.25,
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'primary.dark' },
                                '&.Mui-disabled': { bgcolor: '#dfe7d4', color: '#8ca47a' },
                            }}
                        >
                            <Send fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default ChatbotWidget;
