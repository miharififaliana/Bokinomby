import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
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

export default function Index({ personnes, success }) {
    const reduceMotion = useReducedMotion();
    const hasPersonnes = personnes.data.length > 0;

    return (
        <AuthenticatedLayout>
            <Head title="Personnes" />

            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-sm text-base-content/45">
                        Propriétaires
                    </p>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
                                Les personnes du registre.
                            </h1>
                            <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-base-content/60">
                                Chaque personne peut détenir plusieurs bovins.
                                Ouvrez sa fiche pour voir son cheptel et lui
                                assigner une nouvelle bête.
                            </p>
                        </div>

                        <Link
                            href={route('personnes.create')}
                            className="btn btn-primary h-11 rounded-full px-6 text-sm font-semibold normal-case"
                        >
                            Ajouter une personne
                        </Link>
                    </div>
                </motion.div>

                {success && (
                    <motion.p
                        role="status"
                        initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 rounded-2xl border border-success/25 bg-success/10 px-5 py-4 text-sm font-medium text-success"
                    >
                        {success}
                    </motion.p>
                )}

                {hasPersonnes ? (
                    <>
                        <p className="mt-10 border-y border-base-content/15 py-4 text-xs text-base-content/45">
                            {personnes.from}–{personnes.to} sur {personnes.total}{' '}
                            {personnes.total > 1 ? 'personnes' : 'personne'}
                        </p>

                        <div className="border-t border-base-content/15">
                            {personnes.data.map((personne) => (
                                <Link
                                    key={personne.id}
                                    href={route('personnes.show', personne.id)}
                                    className="group grid gap-4 border-b border-base-content/15 py-5 transition-colors hover:bg-base-200/40 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xs text-primary-content">
                                            {initials(personne.nom)}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-display text-xl tracking-tight">
                                                {personne.nom}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-base-content/50">
                                                {personne.telephone ||
                                                    personne.email ||
                                                    'Aucune coordonnée'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="min-w-0 ps-16 sm:ps-0">
                                        <p className="text-sm font-medium">
                                            {personne.bovins_count}{' '}
                                            {personne.bovins_count > 1
                                                ? 'bovins'
                                                : 'bovin'}
                                        </p>
                                        <p className="mt-0.5 text-xs text-base-content/45">
                                            Assignés à cette personne
                                        </p>
                                    </div>

                                    <span className="text-xs font-semibold text-primary underline-offset-4 group-hover:underline sm:justify-self-end">
                                        Voir la fiche →
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {personnes.last_page > 1 && (
                            <nav
                                aria-label="Pagination des personnes"
                                className="mt-8 flex items-center justify-between gap-4"
                            >
                                {personnes.prev_page_url ? (
                                    <Link
                                        href={personnes.prev_page_url}
                                        preserveScroll
                                        className="btn btn-outline h-10 rounded-full border-base-content/20 px-5 text-xs font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                                    >
                                        Précédent
                                    </Link>
                                ) : (
                                    <span />
                                )}

                                <p className="text-xs text-base-content/45">
                                    Page {personnes.current_page} sur{' '}
                                    {personnes.last_page}
                                </p>

                                {personnes.next_page_url ? (
                                    <Link
                                        href={personnes.next_page_url}
                                        preserveScroll
                                        className="btn btn-outline h-10 rounded-full border-base-content/20 px-5 text-xs font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                                    >
                                        Suivant
                                    </Link>
                                ) : (
                                    <span />
                                )}
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="mt-10 rounded-[2rem] border border-dashed border-base-content/20 px-6 py-14 text-center sm:px-12">
                        <p className="font-display text-3xl tracking-tight">
                            Aucune personne inscrite.
                        </p>
                        <p className="mx-auto mt-3 max-w-[44ch] text-sm leading-relaxed text-base-content/55">
                            Créez la fiche d'un propriétaire, puis rattachez-lui
                            un ou plusieurs bovins depuis son dossier.
                        </p>
                        <Link
                            href={route('personnes.create')}
                            className="btn btn-primary mt-7 h-11 rounded-full px-6 text-sm font-semibold normal-case"
                        >
                            Ajouter la première personne
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
