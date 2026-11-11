export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `inline-flex items-center justify-center px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 border border-transparent rounded-xl font-medium text-sm text-white tracking-wide shadow-sm hover:shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-[#1C1C20] disabled:opacity-50 disabled:cursor-not-allowed ${
                    disabled && 'opacity-50'
                } ` + className
            }
        >
            {children}
        </button>
    );
}
