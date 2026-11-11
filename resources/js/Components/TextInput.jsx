import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-xl border border-slate-300 dark:border-[#2C2C32] bg-white dark:bg-[#151518] text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 shadow-xs focus:border-blue-600 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-600/20 dark:focus:ring-zinc-400/20 transition duration-150 ' +
                className
            }
            ref={localRef}
        />
    );
});
