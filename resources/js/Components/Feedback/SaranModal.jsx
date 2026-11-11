import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import {
    CheckCircle2,
    Edit3,
    ExternalLink,
    Mail,
    MessageSquarePlus,
    Phone,
    Send,
    X,
} from 'lucide-react';

const DEVELOPER_WA_NUMBER = '6283877392831';
const DEVELOPER_WA_DISPLAY = '0838-7739-2831';
const DEVELOPER_EMAIL = 'mhmmdhaidar1212@gmail.com';
const DEVELOPER_INSTAGRAM_HANDLE = '@hdarrrr_12';
const DEVELOPER_INSTAGRAM_URL = 'https://www.instagram.com/hdarrrr_12';

function normalizeIndonesianWhatsAppNumber(raw = '') {
    const trimmed = String(raw).trim();
    if (!trimmed || /[a-zA-Z]/.test(trimmed)) {
        return null;
    }

    let digits = trimmed.replace(/\D+/g, '');
    if (!digits) {
        return null;
    }

    if (digits.startsWith('08')) {
        digits = '62' + digits.slice(1);
    } else if (digits.startsWith('8')) {
        digits = '62' + digits;
    }

    if (!/^628(?:1[1-9]|2[1-9]|3[1-8]|5[1-9]|7[7-9]|8[1-9]|9[5-9])[0-9]{6,10}$/.test(digits)) {
        return null;
    }

    return digits;
}

function formatLocalPhoneDisplay(phone = '') {
    if (!phone) return '';
    const digits = String(phone).replace(/\D+/g, '');
    if (digits.startsWith('62')) {
        return '0' + digits.slice(2);
    }
    return digits;
}

function formatTimestamp(isoString) {
    if (!isoString) return 'Baru saja';
    try {
        const date = new Date(isoString);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return 'Baru saja';
    }
}

export default function SaranModal({ isOpen, onClose }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const firstName = user?.name ? user.name.split(' ')[0] : 'Teman';

    const [items, setItems] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const [savedPhone, setSavedPhone] = useState(user?.no_telp || '');
    const [phoneInput, setPhoneInput] = useState(formatLocalPhoneDisplay(user?.no_telp || ''));
    const [isEditingPhone, setIsEditingPhone] = useState(!user?.no_telp);
    const [whatsappConfirmed, setWhatsappConfirmed] = useState(Boolean(user?.no_telp));

    const [isiSaran, setIsiSaran] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const threadEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Pre-formatted developer contact links
    const displaySavedPhone = formatLocalPhoneDisplay(savedPhone);
    const waTemplateText = [
        `Halo Haidar (Pengembang Uangku), saya ${user.name || 'Pengguna Uangku'} (${user.email || '-'}).`,
        '',
        'Saya ingin menyampaikan saran/masukan untuk aplikasi Uangku:',
        '[Tulis saran atau masukan Anda di sini]',
    ].join('\n');
    const waHref = `https://wa.me/${DEVELOPER_WA_NUMBER}?text=${encodeURIComponent(waTemplateText)}`;

    const mailSubject = `[Saran & Masukan Uangku] dari ${user.name || 'Pengguna'}`;
    const mailBody = [
        'Halo Nur Muhammad Haidar,',
        '',
        'Saya pengguna aplikasi Uangku:',
        `- Nama: ${user.name || '-'}`,
        `- Email: ${user.email || '-'}`,
        ...(displaySavedPhone ? [`- No. WhatsApp: ${displaySavedPhone}`] : []),
        '',
        'Saran & Masukan:',
        '[Tulis saran, laporan bug, atau ide fitur Anda di sini]',
        '',
        'Terima kasih!',
    ].join('\n');
    const mailHref = `mailto:${DEVELOPER_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    useEffect(() => {
        if (!isOpen) return;

        let active = true;
        setLoadingHistory(true);
        setErrorMessage('');

        axios
            .get(route('saran.index'))
            .then((res) => {
                if (!active) return;
                const fetchedItems = res.data?.items || [];
                const fetchedPhone = res.data?.no_telp || user?.no_telp || '';

                setItems(fetchedItems);
                setSavedPhone(fetchedPhone);
                if (fetchedPhone) {
                    setPhoneInput(formatLocalPhoneDisplay(fetchedPhone));
                    setIsEditingPhone(false);
                    setWhatsappConfirmed(true);
                } else {
                    setIsEditingPhone(true);
                }
            })
            .catch(() => {
                if (active) {
                    setErrorMessage('Gagal memuat riwayat saran sebelumnya.');
                }
            })
            .finally(() => {
                if (active) setLoadingHistory(false);
            });

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            active = false;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && items.length > 0) {
            setTimeout(() => {
                threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 80);
        }
    }, [items.length, isOpen]);

    if (!isOpen || typeof document === 'undefined') return null;

    const effectiveRawPhone = isEditingPhone ? phoneInput : (savedPhone || phoneInput);
    const normalizedPreviewPhone = normalizeIndonesianWhatsAppNumber(effectiveRawPhone);
    const hasValidPhone = Boolean(normalizedPreviewPhone);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setFieldErrors({});

        const nextErrors = {};
        if (!effectiveRawPhone.trim()) {
            nextErrors.no_telp = 'Nomor telepon WhatsApp wajib diisi sebelum mengirim saran.';
        } else if (!normalizedPreviewPhone) {
            nextErrors.no_telp = 'Format nomor WhatsApp Indonesia tidak valid (contoh: 0838xxxxxxx atau +62838xxxxxxx).';
        }

        if (!whatsappConfirmed) {
            nextErrors.whatsapp_confirmed = 'Centang konfirmasi bahwa nomor telepon terdaftar aktif di WhatsApp.';
        }

        if (!isiSaran.trim() || isiSaran.trim().length < 5) {
            nextErrors.isi_saran = 'Saran & masukan minimal 5 karakter agar dapat dipahami dengan jelas.';
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(route('saran.store'), {
                no_telp: effectiveRawPhone.trim(),
                whatsapp_confirmed: whatsappConfirmed ? 1 : 0,
                isi_saran: isiSaran.trim(),
            });

            const created = response.data?.saran;
            const latestPhone = response.data?.no_telp || normalizedPreviewPhone;

            if (created) {
                setItems((prev) => [...prev, created]);
            }
            setSavedPhone(latestPhone);
            setPhoneInput(formatLocalPhoneDisplay(latestPhone));
            setIsEditingPhone(false);
            setWhatsappConfirmed(true);
            setIsiSaran('');

            setTimeout(() => {
                threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            if (err?.response?.status === 422) {
                const srvErrors = err.response.data?.errors || {};
                const parsed = {};
                Object.keys(srvErrors).forEach((key) => {
                    parsed[key] = Array.isArray(srvErrors[key]) ? srvErrors[key][0] : srvErrors[key];
                });
                setFieldErrors(parsed);
            } else if (err?.response?.status === 429) {
                setErrorMessage('Terlalu banyak pengiriman beruntun. Mohon tunggu sebentar lalu coba lagi.');
            } else {
                setErrorMessage('Gagal mengirim saran & masukan. Periksa koneksi internet Anda lalu coba lagi.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[72] flex items-end sm:items-center justify-center pt-[calc(2.5rem+env(safe-area-inset-top,0px))] sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Saran & Masukan"
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-[#070D19]/65 backdrop-blur-xs transition-opacity"
            />

            {/* Responsive Panel: Mobile safe-area bottom sheet, Desktop perfectly centered dialog */}
            <div className="relative z-10 w-full h-full sm:h-auto sm:max-h-[min(86vh,700px)] sm:max-w-xl flex flex-col bg-white dark:bg-[#0B1426] border-t sm:border border-slate-200 dark:border-[#1E3158] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-tupi-spring">
                {/* Header */}
                <div className="shrink-0 px-5 py-4 bg-slate-50/90 dark:bg-[#0E1A33] border-b border-slate-200 dark:border-[#1E3158] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-[#112143] text-white flex items-center justify-center shrink-0 shadow-sm">
                            <MessageSquarePlus className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                                Saran &amp; Masukan
                            </h2>
                            <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 truncate">
                                Hubungi Pengembang &bull; Nur Muhammad Haidar
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup Saran & Masukan"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#1E3158] transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* External Developer Contact Options */}
                <div className="shrink-0 px-4 py-3 bg-white dark:bg-[#0B1426] border-b border-slate-200/80 dark:border-[#1E3158]/80 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Hubungi Pengembang Secara Langsung
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        {/* WhatsApp */}
                        <a
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 p-2.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 border border-emerald-200/80 dark:border-emerald-500/25 text-emerald-800 dark:text-emerald-300 transition group text-center sm:text-left"
                        >
                            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                                    <path d="M12.03 2a9.97 9.97 0 0 0-8.44 15.3L2 22l4.86-1.52A9.96 9.96 0 1 0 12.03 2Zm5.8 14.12c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.83-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.4-.14-.2-1.19-1.58-1.19-3.01s.75-2.14 1.02-2.43c.27-.29.59-.36.79-.36h.57c.18 0 .43-.07.67.51.24.59.84 2.04.91 2.19.07.15.12.33.02.53-.1.2-.15.33-.3.5-.14.18-.31.4-.44.53-.14.15-.3.31-.13.61.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.3 2.34 1.44.3.15.47.12.64-.07.18-.2.74-.86.94-1.16.2-.29.4-.25.67-.15.27.1 1.72.81 2.01.96.3.15.5.22.57.34.07.12.07.7-.17 1.38Z" />
                                </svg>
                            </span>
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold leading-tight flex items-center justify-center sm:justify-start gap-1">
                                    <span>WhatsApp</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-60 hidden sm:inline" />
                                </p>
                                <p className="text-[10px] opacity-80 truncate hidden sm:block">{DEVELOPER_WA_DISPLAY}</p>
                            </div>
                        </a>

                        {/* Email */}
                        <a
                            href={mailHref}
                            className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 p-2.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100/80 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 border border-blue-200/80 dark:border-blue-500/25 text-blue-800 dark:text-blue-300 transition group text-center sm:text-left"
                        >
                            <span className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition">
                                <Mail className="w-3.5 h-3.5" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold leading-tight flex items-center justify-center sm:justify-start gap-1">
                                    <span>Email</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-60 hidden sm:inline" />
                                </p>
                                <p className="text-[10px] opacity-80 truncate hidden sm:block">Format Otomatis</p>
                            </div>
                        </a>

                        {/* Instagram */}
                        <a
                            href={DEVELOPER_INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 p-2.5 rounded-2xl bg-rose-50/70 hover:bg-rose-100/80 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 border border-rose-200/80 dark:border-rose-500/25 text-rose-800 dark:text-rose-300 transition group text-center sm:text-left"
                        >
                            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.2" aria-hidden="true">
                                    <rect x="3" y="3" width="18" height="18" rx="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
                                </svg>
                            </span>
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold leading-tight flex items-center justify-center sm:justify-start gap-1">
                                    <span>Instagram</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-60 hidden sm:inline" />
                                </p>
                                <p className="text-[10px] opacity-80 truncate hidden sm:block">{DEVELOPER_INSTAGRAM_HANDLE}</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Real-Time In-App Feedback Stream */}
                <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3.5 space-y-3.5 bg-slate-50/60 dark:bg-[#0A1120]">
                    {/* Intro Welcome Bubble */}
                    <div className="flex items-end gap-2 justify-start">
                        <img
                            src="/assets/mascot-avatar.png"
                            alt="Uangku"
                            className="w-7 h-7 rounded-lg object-cover shrink-0 mb-0.5 border border-slate-200 dark:border-[#1E3158]"
                        />
                        <div className="max-w-[88%] px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-white dark:bg-[#0E1A33] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#1E3158] shadow-2xs text-xs leading-relaxed">
                            <p className="font-bold text-slate-900 dark:text-white mb-1">
                                Halo {firstName}! Ada saran atau keluhan?
                            </p>
                            <p>
                                Anda bisa langsung kirim masukan lewat form di bawah ini secara <strong>real-time</strong> ke database pengembang. Semua masukan akan dijadikan bahan evaluasi untuk pengembangan Uangku.
                            </p>
                        </div>
                    </div>

                    {loadingHistory ? (
                        <div className="py-4 text-center text-xs text-slate-400">
                            Memuat riwayat saran Anda...
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="space-y-2.5">
                                {/* User Sent Saran Bubble */}
                                <div className="flex flex-col items-end">
                                    <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-br-md bg-blue-600 text-white shadow-2xs text-xs leading-relaxed">
                                        <p className="whitespace-pre-wrap font-medium">{item.isi_saran}</p>
                                    </div>
                                    <span className="mt-1 text-[10px] text-slate-400 pr-1">
                                        Terkirim ({formatLocalPhoneDisplay(item.no_telp)}) &bull; {formatTimestamp(item.created_at)}
                                    </span>
                                </div>

                                {/* Automatic Thank-You Reply Bubble */}
                                {item.balasan_otomatis && (
                                    <div className="flex items-end gap-2 justify-start">
                                        <img
                                            src="/assets/tupi/tupi-wave.png"
                                            alt="Pengembang Uangku"
                                            className="w-7 h-7 rounded-lg object-contain bg-amber-50 dark:bg-amber-500/10 p-0.5 shrink-0 mb-0.5 border border-amber-200/80 dark:border-amber-500/30"
                                        />
                                        <div className="max-w-[88%] px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-white dark:bg-[#0E1A33] text-slate-700 dark:text-slate-200 border border-blue-200/80 dark:border-blue-500/30 shadow-2xs text-xs leading-relaxed">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400">
                                                    Balasan Otomatis Pengembang
                                                </span>
                                            </div>
                                            <p className="whitespace-pre-wrap">{item.balasan_otomatis}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    <div ref={threadEndRef} />
                </div>

                {/* Mandatory WhatsApp Verification + Feedback Composer */}
                <form
                    onSubmit={handleSubmit}
                    className="shrink-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:pb-4 bg-white dark:bg-[#0E1A33] border-t border-slate-200 dark:border-[#1E3158] space-y-3"
                >
                    {errorMessage && (
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-xs font-medium text-rose-700 dark:text-rose-300">
                            {errorMessage}
                        </div>
                    )}

                    {/* WhatsApp Phone Step */}
                    {savedPhone && !isEditingPhone ? (
                        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-blue-50/70 dark:bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/25 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                                <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                <span className="text-slate-600 dark:text-slate-300 truncate">
                                    No. WhatsApp: <strong className="text-slate-900 dark:text-white font-mono">{formatLocalPhoneDisplay(savedPhone)}</strong>
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditingPhone(true);
                                    setFieldErrors({});
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                            >
                                <Edit3 className="w-3 h-3" />
                                <span>Ubah</span>
                            </button>
                        </div>
                    ) : (
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0A1120] border border-slate-200 dark:border-[#1E3158] space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <label htmlFor="saran_no_telp" className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    <span>Nomor WhatsApp Aktif *</span>
                                </label>
                                {hasValidPhone && (
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Format Valid
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    id="saran_no_telp"
                                    type="tel"
                                    inputMode="tel"
                                    value={phoneInput}
                                    onChange={(e) => setPhoneInput(e.target.value)}
                                    placeholder="Contoh: 083877392831"
                                    disabled={isSubmitting}
                                    className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-[#1E3158] bg-white dark:bg-[#0E1A33] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 font-mono"
                                />
                                {savedPhone && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPhoneInput(formatLocalPhoneDisplay(savedPhone));
                                            setIsEditingPhone(false);
                                            setWhatsappConfirmed(true);
                                        }}
                                        className="px-2.5 py-2 rounded-xl text-[11px] font-semibold text-slate-500 hover:bg-slate-200/70 dark:hover:bg-[#1E3158] transition"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>

                            {fieldErrors.no_telp && (
                                <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                    {fieldErrors.no_telp}
                                </p>
                            )}

                            <label className="flex items-start gap-2 cursor-pointer select-none pt-0.5">
                                <input
                                    type="checkbox"
                                    checked={whatsappConfirmed}
                                    onChange={(e) => setWhatsappConfirmed(e.target.checked)}
                                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
                                />
                                <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                                    Saya memastikan nomor di atas aktif dan terdaftar di <strong>WhatsApp</strong> agar pengembang bisa menindaklanjuti saran saya.
                                </span>
                            </label>

                            {fieldErrors.whatsapp_confirmed && (
                                <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                    {fieldErrors.whatsapp_confirmed}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Feedback Textarea + Send Button */}
                    <div className="space-y-1.5">
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={textareaRef}
                                rows={2}
                                value={isiSaran}
                                onChange={(e) => setIsiSaran(e.target.value)}
                                placeholder="Tulis saran, kritik, atau ide fitur baru untuk Uangku..."
                                disabled={isSubmitting}
                                maxLength={2000}
                                className="flex-1 max-h-28 px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-300 dark:border-[#1E3158] bg-slate-50 dark:bg-[#0A1120] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 resize-none disabled:opacity-60"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !isiSaran.trim()}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-600/25 transition disabled:opacity-50 shrink-0"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>{isSubmitting ? 'Mengirim...' : 'Kirim'}</span>
                            </button>
                        </div>

                        {fieldErrors.isi_saran && (
                            <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                {fieldErrors.isi_saran}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
