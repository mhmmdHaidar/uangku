export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-blue-600 dark:text-zinc-200 shadow-sm focus:ring-blue-500 dark:border-[#32323A] dark:bg-[#151518] dark:focus:ring-zinc-400 dark:focus:ring-offset-[#1C1C20] ' +
                className
            }
        />
    );
}
