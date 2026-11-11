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
                `inline-flex items-center justify-center px-4 py-2.5 bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white active:scale-[0.98] border border-transparent rounded-2xl font-bold text-sm text-white dark:text-zinc-950 tracking-wide shadow-md shadow-[#00105B]/20 dark:shadow-black/40 hover:shadow-lg hover:shadow-[#00105B]/30 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00105B] dark:focus:ring-zinc-400 focus:ring-offset-2 dark:focus:ring-offset-[#1C1C20] disabled:opacity-50 disabled:cursor-not-allowed ${
                    disabled && 'opacity-50'
                } ` + className
            }
        >
            {children}
        </button>
    );
}
