import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import UserAvatar from '@/Components/UserAvatar';
import { Transition } from '@headlessui/react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Camera, Loader2, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

const prepareAvatarUploadFile = (file) =>
    new Promise((resolve) => {
        if (!file || typeof document === 'undefined' || !ALLOWED_AVATAR_TYPES.includes(file.type)) {
            resolve(file);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            try {
                const minSide = Math.min(img.width, img.height);
                const targetSize = Math.min(minSide, 400);
                const sx = Math.floor((img.width - minSide) / 2);
                const sy = Math.floor((img.height - minSide) / 2);

                const canvas = document.createElement('canvas');
                canvas.width = targetSize;
                canvas.height = targetSize;
                const ctx = canvas.getContext('2d');

                if (!ctx || targetSize <= 0) {
                    URL.revokeObjectURL(objectUrl);
                    resolve(file);
                    return;
                }

                const usePng = file.type === 'image/png' || file.type === 'image/webp';
                const outputMime = usePng ? 'image/png' : 'image/jpeg';

                if (!usePng) {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, targetSize, targetSize);
                }

                ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetSize, targetSize);

                canvas.toBlob(
                    (blob) => {
                        URL.revokeObjectURL(objectUrl);
                        if (!blob) {
                            resolve(file);
                            return;
                        }
                        const ext = usePng ? 'png' : 'jpg';
                        resolve(new File([blob], `avatar.${ext}`, { type: outputMime }));
                    },
                    outputMime,
                    usePng ? undefined : 0.85,
                );
            } catch {
                URL.revokeObjectURL(objectUrl);
                resolve(file);
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(file);
        };

        img.src = objectUrl;
    });

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const fileInputRef = useRef(null);

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarRemoving, setAvatarRemoving] = useState(false);
    const [avatarError, setAvatarError] = useState('');

    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const handleAvatarSelect = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        e.target.value = '';
        setAvatarError('');

        if (!ALLOWED_AVATAR_TYPES.includes(selectedFile.type)) {
            setAvatarError('Format gambar harus berupa JPG, PNG, atau WebP.');
            return;
        }

        if (selectedFile.size > MAX_AVATAR_BYTES) {
            setAvatarError('Ukuran file gambar maksimal 5 MB.');
            return;
        }

        const localPreviewUrl = URL.createObjectURL(selectedFile);
        setAvatarPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return localPreviewUrl;
        });
        setAvatarUploading(true);

        const uploadFile = await prepareAvatarUploadFile(selectedFile);

        router.post(
            route('profile.avatar.update'),
            { avatar: uploadFile },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setAvatarPreview((prev) => {
                        if (prev) URL.revokeObjectURL(prev);
                        return null;
                    });
                },
                onError: (err) => {
                    setAvatarPreview((prev) => {
                        if (prev) URL.revokeObjectURL(prev);
                        return null;
                    });
                    setAvatarError(err.avatar || 'Gagal mengunggah gambar profil.');
                },
                onFinish: () => {
                    setAvatarUploading(false);
                },
            },
        );
    };

    const handleAvatarRemove = () => {
        setAvatarError('');
        setAvatarRemoving(true);

        router.delete(route('profile.avatar.destroy'), {
            preserveScroll: true,
            onFinish: () => {
                setAvatarRemoving(false);
            },
        });
    };

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Informasi Profil
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Perbarui foto profil, nama tampilan, dan alamat email akun Anda.
                </p>
            </header>

            {/* Foto Profil Uploader */}
            <div className="mt-6 pb-6 border-b border-slate-200/80 dark:border-[#2C2C32]">
                <InputLabel value="Foto Profil" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-3" />

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative w-fit shrink-0">
                        <UserAvatar
                            user={user}
                            previewUrl={avatarPreview}
                            sizeClass="w-20 h-20"
                            textClass="text-2xl font-extrabold"
                            className="ring-2 ring-slate-200 dark:ring-[#32323A] shadow-md"
                        />

                        {(avatarUploading || avatarRemoving) && (
                            <div className="absolute inset-0 rounded-full bg-black/55 backdrop-blur-[1px] flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={avatarUploading || avatarRemoving}
                            aria-label="Pilih foto profil"
                            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 border-2 border-white dark:border-[#1C1C20] flex items-center justify-center shadow-md transition active:scale-95 disabled:opacity-50"
                        >
                            <Camera className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarSelect}
                            className="hidden"
                        />

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={avatarUploading || avatarRemoving}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                <span>
                                    {avatarUploading
                                        ? 'Mengunggah...'
                                        : user.avatar_url
                                            ? 'Ganti Foto'
                                            : 'Unggah Foto'}
                                </span>
                            </button>

                            {user.avatar_url && (
                                <button
                                    type="button"
                                    onClick={handleAvatarRemove}
                                    disabled={avatarUploading || avatarRemoving}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold transition active:scale-95 disabled:opacity-50"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>{avatarRemoving ? 'Menghapus...' : 'Hapus Foto'}</span>
                                </button>
                            )}
                        </div>

                        <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                            Format JPG, PNG, atau WebP &bull; Maksimal 5 MB (otomatis dipotong lingkaran).
                        </p>

                        <InputError message={avatarError} className="mt-1" />
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-1" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-1" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-xs text-slate-700 dark:text-slate-300">
                            Email Anda belum diverifikasi.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="text-[#00105B] dark:text-zinc-200 hover:underline"
                            >
                                Kirim ulang link verifikasi email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                Link verifikasi baru telah dikirim ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Profil'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Tersimpan!
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
