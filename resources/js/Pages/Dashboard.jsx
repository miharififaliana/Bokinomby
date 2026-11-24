import EarTag from '@/Components/EarTag';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';

function initials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const reduceMotion = useReducedMotion();

    const firstName = user.name.split(' ')[0];
    const roleLabel = user.role === 'admin' ? 'Administrateur' : 'Employé';

    const today = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(new Date());

    const memberSince = user.created_at
        ? new Intl.DateTimeFormat('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          }).format(new Date(user.created_at))
        : '—';

    const rows = [
        {
            term: 'Profil',
            value: `${user.name} · ${user.email}`,
            action: { label: 'Modifier', href: route('profile.edit') },
        },
        {
            term: 'Sécurité',
            value: 'Mot de passe et accès au compte.',
            action: {
                label: 'Changer',
                href: `${route('profile.edit')}#password`,
            },
        },
        {
            term: 'Rôle',
            value: roleLabel,
        },
        {
            term: 'Membre depuis',
            value: memberSince,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Tableau de bord" />

            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-sm capitalize text-base-content/45">
                        {today}
                    </p>

                    <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
                        Bonjour, {firstName}.
                    </h1>

                    <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-base-content/60">
                        Votre accès au registre est actif. Retrouvez ici les
                        informations de votre compte et les réglages de votre
                        dossier.
                    </p>
                </motion.div>

                <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                    <section aria-labelledby="espace-heading">
                        <h2
                            id="espace-heading"
                            className="text-sm font-semibold text-base-content/45"
                        >
                            Votre espace
                        </h2>

                        <dl className="mt-3">
                            {rows.map((row) => (
                                <div
                                    key={row.term}
                                    className="flex flex-wrap items-center justify-between gap-4 border-t border-base-content/15 py-5"
                                >
                                    <div className="min-w-0">
                                        <dt className="text-[13px] font-semibold">
                                            {row.term}
                                        </dt>
                                        <dd className="mt-1 truncate text-sm text-base-content/55">
                                            {row.value}
                                        </dd>
                                    </div>

                                    {row.action && (
                                        <Link
                                            href={row.action.href}
                                            className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                                        >
                                            {row.action.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </dl>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href={route('profile.edit')}
                                className="btn btn-primary h-11 rounded-full px-6 text-sm font-semibold normal-case"
                            >
                                Modifier mon profil
                            </Link>
                            <Link
                                href="/"
                                className="btn btn-outline h-11 rounded-full border-base-content/20 px-6 text-sm font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                            >
                                Voir le site
                            </Link>
                        </div>

                        <p className="mt-10 max-w-[46ch] border-t border-base-content/15 pt-6 font-display text-xl leading-snug text-base-content/50">
                            Le registre se tient à jour, une bête à la fois.
                        </p>
                    </section>

                    <aside className="mx-auto w-full max-w-[20rem] lg:mx-0 lg:ms-auto">
                        <motion.div
                            initial={
                                reduceMotion
                                    ? false
                                    : { opacity: 0, y: -28, rotate: -5 }
                            }
                            animate={{ opacity: 1, y: 0, rotate: 2 }}
                            transition={{
                                type: 'spring',
                                stiffness: 70,
                                damping: 15,
                                delay: 0.12,
                            }}
                        >
                            <EarTag
                                number={initials(user.name)}
                                label="BOKINOMBY · MEMBRE"
                                title={user.name}
                                rows={[
                                    ['Rôle', roleLabel],
                                    ['Membre depuis', memberSince],
                                ]}
                                footer="CARTE DE MEMBRE DU REGISTRE"
                            />
                        </motion.div>

                        <p className="mt-6 text-center text-xs text-base-content/45">
                            {user.email}
                        </p>
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
