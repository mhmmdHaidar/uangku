import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-[#00105B] text-gray-900 focus:border-[#00105B] dark:border-zinc-200 dark:text-zinc-100'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200 dark:focus:border-zinc-600 dark:focus:text-zinc-200') +
                className
            }
        >
            {children}
        </Link>
    );
}
