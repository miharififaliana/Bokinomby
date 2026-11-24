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
                'input input-bordered h-11 w-full rounded-xl border-base-content/20 bg-base-100 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ' +
                className
            }
            ref={localRef}
        />
    );
});
