import { useEffect, useState } from 'react';

export default function UserAvatar({
    user,
    previewUrl = null,
    sizeClass = 'w-8 h-8',
    textClass = 'text-xs font-bold',
    className = '',
}) {
    const [imgError, setImgError] = useState(false);
    const src = previewUrl || user?.avatar_url || null;

    useEffect(() => {
        setImgError(false);
    }, [src]);

    const initial = (user?.name || 'U').trim().charAt(0).toUpperCase() || 'U';

    if (src && !imgError) {
        return (
            <div
                className={`${sizeClass} rounded-full overflow-hidden shrink-0 bg-slate-200 dark:bg-[#242429] ring-1 ring-slate-300/80 dark:ring-[#3E3E46] shadow-sm ${className}`}
            >
                <img
                    src={src}
                    alt={user?.name || 'Foto Profil'}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    return (
        <div
            className={`${sizeClass} rounded-full shrink-0 bg-gradient-to-br from-[#001875] via-[#00105B] to-[#000833] dark:from-[#2E2E36] dark:via-[#242429] dark:to-[#18181C] dark:border dark:border-[#3E3E46] text-white flex items-center justify-center shadow-sm ${textClass} ${className}`}
        >
            {initial}
        </div>
    );
}
