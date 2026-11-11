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
                `inline-flex items-center justify-center px-4 py-2.5 bg-white dark:bg-[#242429] border border-slate-300 dark:border-[#32323A] rounded-2xl font-semibold text-sm text-slate-700 dark:text-zinc-200 shadow-xs hover:bg-slate-50 dark:hover:bg-[#2E2E35] active:scale-[0.98] transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-[#1C1C20] disabled:opacity-50 disabled:cursor-not-allowed ${
                    disabled && 'opacity-50'
                } ` + className
            }
        >
            {children}
        </button>
    );
}
