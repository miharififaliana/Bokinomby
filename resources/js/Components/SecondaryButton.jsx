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
            className={`btn btn-outline min-h-0 h-11 rounded-full border-base-content/20 px-6 text-sm font-semibold normal-case tracking-normal hover:border-base-content/40 hover:bg-base-200 ${
                disabled && 'btn-disabled'
            } ` + className}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
