export default function PrimaryButton({
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
                `inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:bg-none dark:bg-zinc-100 dark:hover:bg-white active:scale-[0.98] border border-transparent rounded-2xl font-bold text-sm text-white dark:text-zinc-950 tracking-wide shadow-md shadow-blue-600/20 dark:shadow-black/40 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-zinc-400 focus:ring-offset-2 dark:focus:ring-offset-[#1C1C20] disabled:opacity-50 disabled:cursor-not-allowed ${
                    disabled && 'opacity-50'
                } ` + className
            }
        >
            {children}
        </button>
    );
}
