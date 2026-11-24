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

function formatDate(value) {
    if (!value) {
        return '—';
    }

    const [year, month, day] = value.slice(0, 10).split('-');

    return `${day}/${month}/${year}`;
}

function sexLabel(sexe) {
    return sexe === 'male' ? 'Mâle' : 'Femelle';
}

export default function Show({ personne, bovins, stats, success }) {
    const reduceMotion = useReducedMotion();
    const hasBovins = bovins.data.length > 0;
    const createHref = route('bovins.create', {
        proprietaire: personne.id,
    });

    return (
        <AuthenticatedLayout>
            <Head title={personne.nom} />

            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Link
                        href={route('personnes.index')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-base-content/50 underline-offset-4 transition-colors hover:text-base-content hover:underline"
                    >
                        <span aria-hidden="true">←</span>
                        Toutes les personnes
                    </Link>

                    <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
                        <div className="flex items-start gap-5">
                            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-content">
                                {initials(personne.nom)}
                            </span>

                            <div>
                                <p className="text-sm text-base-content/45">
                                    Personne propriétaire
                                </p>
                                <h1 className="mt-2 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.03] tracking-[-0.02em]">
                                    {personne.nom}
                                </h1>

                                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-base-content/55">
                                    {personne.telephone ? (
                                        <a
                                            href={`tel:${personne.telephone}`}
                                            className="underline-offset-4 hover:text-base-content hover:underline"
                                        >
                                            {personne.telephone}
                                        </a>
                                    ) : (
                                        <span>Téléphone non renseigné</span>
                                    )}
                                    {personne.email && (
                                        <a
                                            href={`mailto:${personne.email}`}
                                            className="underline-offset-4 hover:text-base-content hover:underline"
                                        >
                                            {personne.email}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Link
                            href={createHref}
                            className="btn btn-primary h-11 rounded-full px-6 text-sm font-semibold normal-case"
                        >
                            Assigner un bovin
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

                <dl className="mt-10 grid grid-cols-3 border-y border-base-content/15">
                    {[
                        ['Boucles', stats.total],
                        ['Femelles', stats.femelles],
                        ['Mâles', stats.males],
                    ].map(([label, value], index) => (
                        <div
                            key={label}
                            className={`px-1 py-5 sm:px-5 ${
                                index > 0
                                    ? 'border-s border-base-content/15 ps-5 sm:ps-8'
                                    : ''
                            }`}
                        >
                            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-base-content/45">
                                {label}
                            </dt>
                            <dd className="mt-2 font-display text-3xl leading-none tracking-tight sm:text-4xl">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>

                <section aria-labelledby="cheptel-heading" className="mt-10">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <h2
                            id="cheptel-heading"
                            className="text-sm font-semibold text-base-content/45"
                        >
                            Bovins de {personne.nom}
                        </h2>
                        {hasBovins && (
                            <p className="text-xs text-base-content/45">
                                {bovins.from}–{bovins.to} sur {bovins.total}
                            </p>
                        )}
                    </div>

                    {hasBovins ? (
                        <>
                            <div className="mt-3 border-t border-base-content/15">
                                {bovins.data.map((bovin) => (
                                    <article
                                        key={bovin.id}
                                        className="grid gap-3 border-b border-base-content/15 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] sm:items-center sm:gap-6"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-display text-xl tracking-tight">
                                                {bovin.numero_boucle}
                                            </p>
                                            <p className="mt-0.5 text-xs text-base-content/55">
                                                {sexLabel(bovin.sexe)} ·
                                                naissance{' '}
                                                {formatDate(
                                                    bovin.date_naissance,
                                                )}
                                            </p>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                {bovin.quartier.name}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-base-content/55">
                                                {bovin.quartier.commune.name}{' '}
                                                ·{' '}
                                                {
                                                    bovin.quartier.commune
                                                        .district.name
                                                }
                                            </p>
                                        </div>

                                        <span
                                            className={`badge w-fit border-0 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                                                bovin.date_deces
                                                    ? 'bg-base-content/10 text-base-content/55'
                                                    : 'bg-success/10 text-success'
                                            }`}
                                        >
                                            {bovin.date_deces
                                                ? 'Décédé'
                                                : 'Actif'}
                                        </span>
                                    </article>
                                ))}
                            </div>

                            {bovins.last_page > 1 && (
                                <nav
                                    aria-label="Pagination des bovins de la personne"
                                    className="mt-6 flex items-center justify-between gap-4"
                                >
                                    {bovins.prev_page_url ? (
                                        <Link
                                            href={bovins.prev_page_url}
                                            preserveScroll
                                            className="btn btn-outline h-10 rounded-full border-base-content/20 px-5 text-xs font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                                        >
                                            Précédent
                                        </Link>
                                    ) : (
                                        <span />
                                    )}

                                    <p className="text-xs text-base-content/45">
                                        Page {bovins.current_page} sur{' '}
                                        {bovins.last_page}
                                    </p>

                                    {bovins.next_page_url ? (
                                        <Link
                                            href={bovins.next_page_url}
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
                        <div className="mt-3 rounded-[2rem] border border-dashed border-base-content/20 px-6 py-12 text-center">
                            <p className="font-display text-2xl tracking-tight">
                                Aucun bovin assigné.
                            </p>
                            <p className="mx-auto mt-2 max-w-[42ch] text-sm leading-relaxed text-base-content/55">
                                Cette personne peut recevoir plusieurs bêtes.
                                Ouvrez une fiche bovine pour lui en assigner
                                une.
                            </p>
                            <Link
                                href={createHref}
                                className="btn btn-primary mt-6 h-11 rounded-full px-6 text-sm font-semibold normal-case"
                            >
                                Assigner un premier bovin
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
