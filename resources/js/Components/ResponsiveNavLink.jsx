import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700 focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800 dark:border-zinc-200 dark:bg-[#242429] dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:bg-[#2E2E35] dark:focus:text-white'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-[#1C1C20] dark:hover:text-zinc-200 dark:focus:border-zinc-600 dark:focus:bg-[#1C1C20] dark:focus:text-zinc-200'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
