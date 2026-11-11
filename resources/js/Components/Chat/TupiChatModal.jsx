import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const QUICK_QUESTIONS = [
    'Cara catat transfer saldo antar dompet?',
    'Bagaimana cara atur anggaran bulanan kategori?',
    'Bagaimana cara filter laporan per dompet?',
    'Bagaimana cara pasang Uangku jadi aplikasi di HP?',
];

function renderBoldSegments(line) {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            return (
                <strong key={idx} className="font-bold text-slate-900 dark:text-white">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return part;
    });
}

function FormattedMessage({ text, isUser }) {
    if (isUser) {
        return <p className="whitespace-pre-wrap leading-relaxed">{text}</p>;
    }

    const lines = String(text || '').split('\n');

    return (
        <div className="space-y-1.5 leading-relaxed">
            {lines.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) {
                    return <div key={i} className="h-1" />;
                }

                // Bullet item (* or -)
                if (/^[-*]\s+/.test(trimmed)) {
                    const content = trimmed.replace(/^[-*]\s+/, '');
                    return (
                        <div key={i} className="flex items-start gap-2 pl-1">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#00105B] dark:bg-zinc-300 shrink-0" />
                            <span>{renderBoldSegments(content)}</span>
                        </div>
                    );
                }

                // Numbered list item (1. , 2. )
                const numMatch = trimmed.match(/^(\d+\.)\s+(.*)$/);
                if (numMatch) {
                    return (
                        <div key={i} className="flex items-start gap-2 pl-0.5">
                            <span className="font-bold text-[#00105B] dark:text-zinc-200 shrink-0">
                                {numMatch[1]}
                            </span>
                            <span>{renderBoldSegments(numMatch[2])}</span>
                        </div>
                    );
                }

                return <p key={i}>{renderBoldSegments(line)}</p>;
            })}
        </div>
    );
}

export default function TupiChatModal({ isOpen, onClose, onStartTour }) {
    const { auth } = usePage().props;
    const firstName = auth?.user?.name ? auth.user.name.split(' ')[0] : 'Teman';

    const createWelcomeMessage = () => ({
        id: 'welcome',
        role: 'model',
        text: `Hai ${firstName}! Ada yang masih bikin bingung di Uangku? Tanya aja ke Tupi soal cara catat transaksi, atur kategori, pisahkan dompet, atau baca laporan keuangan. Tupi siap bantu.`,
    });

    const [messages, setMessages] = useState([createWelcomeMessage]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isSending, isOpen]);

    // Focus input when opened and allow Escape to close
    useEffect(() => {
        if (!isOpen) return;

        const focusTimer = setTimeout(() => {
            inputRef.current?.focus();
        }, 120);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearTimeout(focusTimer);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleResetChat = () => {
        if (isSending) return;
        setMessages([createWelcomeMessage()]);
        setInput('');
        inputRef.current?.focus();
    };

    const sendMessage = async (textOverride = null) => {
        const messageText = (textOverride ?? input).trim();
        if (!messageText || isSending) return;

        const userMsg = {
            id: `u-${Date.now()}`,
            role: 'user',
            text: messageText,
        };

        const historySnapshot = messages
            .filter((m) => m.id !== 'welcome')
            .slice(-10)
            .map((m) => ({ role: m.role, text: m.text }));

        setMessages((prev) => [...prev, userMsg]);
        if (!textOverride) setInput('');
        setIsSending(true);

        try {
            const response = await window.axios.post(route('tanya-tupi.chat'), {
                message: messageText,
                history: historySnapshot,
            });

            const replyText =
                response?.data?.reply ||
                'Hmm, Tupi belum dapat jawaban nih. Coba kirim ulang pertanyaannya ya.';

            setMessages((prev) => [
                ...prev,
                {
                    id: `m-${Date.now()}`,
                    role: 'model',
                    text: replyText,
                },
            ]);
        } catch (err) {
            const serverReply = err?.response?.data?.reply;
            setMessages((prev) => [
                ...prev,
                {
                    id: `e-${Date.now()}`,
                    role: 'model',
                    text:
                        serverReply ||
                        'Waduh, koneksi ke server Tupi lagi bermasalah sebentar. Coba kirim ulang pertanyaanmu ya.',
                },
            ]);
        } finally {
            setIsSending(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    if (!isOpen) return null;

    const showQuickQuestions = messages.length === 1 && !isSending;

    return (
        <div className="fixed inset-0 z-[70]" aria-modal="true" role="dialog" aria-label="Chat Tanya Tupi">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/50 dark:bg-black/75 backdrop-blur-xs transition-opacity"
            />

            {/* Chat Panel: Full screen on mobile with safe-area padding, floating drawer on desktop */}
            <div className="fixed inset-x-0 bottom-0 top-[calc(2.5rem+env(safe-area-inset-top,0px))] sm:top-auto sm:bottom-5 sm:right-5 sm:left-auto z-[71] w-full sm:w-[420px] sm:h-[600px] sm:max-h-[calc(100vh-40px)] flex flex-col bg-white dark:bg-[#1C1C20] border-t sm:border border-slate-200 dark:border-[#2C2C32] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-tupi-spring">
                {/* Header */}
                <div className="shrink-0 px-4 py-3.5 bg-slate-50/90 dark:bg-[#161619] border-b border-slate-200 dark:border-[#2C2C32] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                            <img
                                src="/assets/mascot-avatar.png"
                                alt="Tupi"
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-[#2C2C32]"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#161619] rounded-full" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                                Pusat Bantuan Tupi
                            </h2>
                            <p className="text-[11px] font-medium text-[#00105B] dark:text-zinc-400 truncate">
                                Panduan Tur &amp; Tanya Jawab Asisten
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        {messages.length > 1 && (
                            <button
                                type="button"
                                onClick={handleResetChat}
                                disabled={isSending}
                                className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#2A2A30] transition disabled:opacity-50"
                            >
                                Reset
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Tutup Pusat Bantuan Tupi"
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200/70 dark:hover:bg-[#2A2A30] text-lg font-medium leading-none transition"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                {/* Quick Tour Launcher Strip inside Unified Help Center */}
                {onStartTour && (
                    <div className="shrink-0 px-4 py-2.5 bg-amber-50/85 dark:bg-amber-500/10 border-b border-amber-200/80 dark:border-amber-500/20 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <img
                                src="/assets/tupi/tupi-wave.png"
                                alt="Tur Tupi"
                                className="w-7 h-7 object-contain shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate">
                                    Tur Panduan Interaktif (9 Langkah)
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                                    Keliling fitur aplikasi dipandu langsung oleh Tupi
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onStartTour();
                            }}
                            className="shrink-0 px-3 py-1.5 rounded-xl bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-[11px] font-bold shadow-xs transition active:scale-95"
                        >
                            Putar Tur
                        </button>
                    </div>
                )}

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50 dark:bg-[#121214]">
                    {messages.map((msg) => {
                        const isUser = msg.role === 'user';
                        return (
                            <div
                                key={msg.id}
                                className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                {!isUser && (
                                    <img
                                        src="/assets/mascot-avatar.png"
                                        alt="Tupi"
                                        className="w-7 h-7 rounded-lg object-cover shrink-0 mb-0.5 border border-slate-200 dark:border-[#2C2C32]"
                                    />
                                )}

                                <div
                                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] shadow-2xs ${
                                        isUser
                                            ? 'bg-[#00105B] text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-br-md font-medium'
                                            : 'bg-white dark:bg-[#1C1C20] text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-[#2C2C32] rounded-bl-md'
                                    }`}
                                >
                                    <FormattedMessage text={msg.text} isUser={isUser} />
                                </div>
                            </div>
                        );
                    })}

                    {/* Quick Starter Prompts */}
                    {showQuickQuestions && (
                        <div className="pt-1 pl-9 space-y-2">
                            <p className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
                                Pertanyaan populer:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {QUICK_QUESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => sendMessage(q)}
                                        className="text-left px-3 py-1.5 rounded-xl bg-white dark:bg-[#1C1C20] hover:bg-[#00105B]/10 dark:hover:bg-[#26262C] border border-slate-200 dark:border-[#2C2C32] hover:border-[#00105B]/40 dark:hover:border-[#3E3E46] text-[11px] font-medium text-slate-700 dark:text-zinc-300 transition shadow-2xs"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Typing Indicator */}
                    {isSending && (
                        <div className="flex items-end gap-2 justify-start">
                            <img
                                src="/assets/mascot-avatar.png"
                                alt="Tupi"
                                className="w-7 h-7 rounded-lg object-cover shrink-0 mb-0.5 border border-slate-200 dark:border-[#2C2C32]"
                            />
                            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white dark:bg-[#1C1C20] border border-slate-200 dark:border-[#2C2C32] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00105B] dark:bg-zinc-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00105B] dark:bg-zinc-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00105B] dark:bg-zinc-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Footer */}
                <form
                    onSubmit={handleFormSubmit}
                    className="shrink-0 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-3 bg-white dark:bg-[#161619] border-t border-slate-200 dark:border-[#2C2C32] flex items-end gap-2"
                >
                    <textarea
                        ref={inputRef}
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        placeholder="Ketik pertanyaanmu tentang Uangku..."
                        disabled={isSending}
                        className="flex-1 max-h-28 px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-300 dark:border-[#2C2C32] bg-slate-50 dark:bg-[#121214] text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#00105B] focus:ring-2 focus:ring-[#00105B]/20 dark:focus:border-zinc-400 dark:focus:ring-zinc-400/20 resize-none disabled:opacity-60"
                    />
                    <button
                        type="submit"
                        disabled={isSending || !input.trim()}
                        className="px-4 py-2.5 rounded-2xl bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-sm shadow-[#00105B]/25 dark:shadow-black/40 transition disabled:opacity-50 shrink-0"
                    >
                        {isSending ? '...' : 'Kirim'}
                    </button>
                </form>
            </div>
        </div>
    );
}

