import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ' +
                (active
                    ? 'bg-base-200 text-base-content'
                    : 'text-base-content/60 hover:bg-base-200/60 hover:text-base-content') +
                ' ' +
                className
            }
        >
            {children}
        </Link>
    );
}
