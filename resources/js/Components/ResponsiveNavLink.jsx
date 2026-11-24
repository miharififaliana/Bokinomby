import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-center rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
                active
                    ? 'bg-base-200 text-base-content'
                    : 'text-base-content/70 hover:bg-base-200/60 hover:text-base-content'
            } ${className}`}
        >
            {children}
        </Link>
    );
}
