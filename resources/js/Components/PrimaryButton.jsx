export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={`btn btn-primary min-h-0 h-11 rounded-full px-6 text-sm font-semibold normal-case tracking-normal ${
                disabled && 'btn-disabled'
            } ` + className}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
