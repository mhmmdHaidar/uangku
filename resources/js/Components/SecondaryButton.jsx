export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            className={
                `inline-flex items-center justify-center px-4 py-2.5 bg-white dark:bg-white/[0.05] border border-slate-300 dark:border-white/[0.1] rounded-2xl font-semibold text-sm text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-white/[0.09] active:scale-[0.98] transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed ${
                    disabled && 'opacity-50'
                } ` + className
            }
        >
            {children}
        </button>
    );
}
