import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

function initials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const user = page.props.auth.user;
    const reduceMotion = useReducedMotion();
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    useEffect(() => {
        setShowingNavigationDropdown(false);
    }, [page.url]);

    return (
        <div className="min-h-screen bg-base-100">
            <nav className="sticky top-0 z-30 border-b border-base-content/10 bg-base-100/85 backdrop-blur-md">
                <div className="mx-auto max-w-6xl px-5 sm:px-8">
                    <div className="flex h-[72px] items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-2.5">
                                <ApplicationLogo className="h-9 w-auto text-primary" />
                                <span className="font-display text-xl tracking-tight">
                                    Bokinomby
                                </span>
                            </Link>
                            <span className="hidden h-5 w-px bg-base-content/15 sm:block" />
                            <span className="hidden text-[11px] tracking-[0.14em] text-base-content/45 sm:block">
                                REGISTRE BOVIN
                            </span>
                        </div>

                        <div className="hidden items-center gap-1 sm:flex">
                            <NavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                Tableau de bord
                            </NavLink>
                            <NavLink
                                href={route('bovins.index')}
                                active={route().current('bovins.*')}
                            >
                                Registre
                            </NavLink>
                            <NavLink
                                href={route('personnes.index')}
                                active={route().current('personnes.*')}
                            >
                                Personnes
                            </NavLink>
                            <NavLink
                                href={route('profile.edit')}
                                active={route().current('profile.*')}
                            >
                                Profil
                            </NavLink>

                            <div className="ms-4 border-s border-base-content/10 ps-4">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2.5 rounded-full py-1 ps-1 pe-2 transition hover:bg-base-200"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-xs text-primary-content">
                                                {initials(user.name)}
                                            </span>
                                            <span className="max-w-[9rem] truncate text-sm font-medium">
                                                {user.name}
                                            </span>
                                            <svg
                                                className="h-3.5 w-3.5 text-base-content/50"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="border-b border-base-content/10 px-4 py-3">
                                            <p className="truncate text-sm font-semibold">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-xs text-base-content/55">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Mon profil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Se déconnecter
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                setShowingNavigationDropdown(
                                    (previousState) => !previousState,
                                )
                            }
                            className="btn btn-ghost btn-sm h-10 w-10 rounded-full p-0 sm:hidden"
                            aria-label={
                                showingNavigationDropdown
                                    ? 'Fermer le menu'
                                    : 'Ouvrir le menu'
                            }
                            aria-expanded={showingNavigationDropdown}
                        >
                            <svg
                                className="h-5 w-5"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    className={
                                        !showingNavigationDropdown
                                            ? 'inline-flex'
                                            : 'hidden'
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M4 7h16M4 12h16M4 17h16"
                                />
                                <path
                                    className={
                                        showingNavigationDropdown
                                            ? 'inline-flex'
                                            : 'hidden'
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {showingNavigationDropdown && (
                        <motion.div
                            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="overflow-hidden border-t border-base-content/10 sm:hidden"
                        >
                            <div className="space-y-1 px-5 py-4">
                                <ResponsiveNavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Tableau de bord
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('bovins.index')}
                                    active={route().current('bovins.*')}
                                >
                                    Registre bovin
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('personnes.index')}
                                    active={route().current('personnes.*')}
                                >
                                    Personnes
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('profile.edit')}
                                    active={route().current('profile.*')}
                                >
                                    Profil
                                </ResponsiveNavLink>
                            </div>

                            <div className="border-t border-base-content/10 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-content">
                                        {initials(user.name)}
                                    </span>
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-semibold">
                                            {user.name}
                                        </div>
                                        <div className="truncate text-xs text-base-content/55">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                    >
                                        Se déconnecter
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {header && (
                <header className="border-b border-base-content/10 bg-base-100">
                    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
