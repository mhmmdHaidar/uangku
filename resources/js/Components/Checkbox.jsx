export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-[#00105B] dark:text-zinc-200 shadow-sm focus:ring-[#00105B] dark:border-[#32323A] dark:bg-[#151518] dark:focus:ring-zinc-400 dark:focus:ring-offset-[#1C1C20] ' +
                className
            }
        />
    );
}
