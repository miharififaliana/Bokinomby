export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={`btn btn-error min-h-0 h-11 rounded-full px-6 text-sm font-semibold normal-case tracking-normal text-error-content ${
                disabled && 'btn-disabled'
            } ` + className}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
