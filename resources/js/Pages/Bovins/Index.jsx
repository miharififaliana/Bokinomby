import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';

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

export default function Index({ bovins, stats, success }) {
    const reduceMotion = useReducedMotion();
    const hasBovins = bovins.data.length > 0;

    return (
        <AuthenticatedLayout>
            <Head title="Registre bovin" />

            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-sm text-base-content/45">
                        Registre bovin
                    </p>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
                                Le cheptel enregistré.
                            </h1>
                            <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-base-content/60">
                                Chaque boucle ouvre un dossier unique : identité,
                                origine, localisation et suivi sanitaire de la
                                bête.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href={route('personnes.index')}
                                className="btn btn-outline h-11 rounded-full border-base-content/20 px-6 text-sm font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                            >
                                Les personnes
                            </Link>
                            <Link
                                href={route('bovins.create')}
                                className="btn btn-primary h-11 rounded-full px-6 text-sm font-semibold normal-case"
                            >
                                Enregistrer un bovin
                            </Link>
                        </div>
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

                {hasBovins ? (
                    <>
                        <div className="mt-4 flex items-center justify-between gap-4 py-3 text-xs text-base-content/45">
                            <p>
                                {bovins.from}–{bovins.to} sur {bovins.total}{' '}
                                {bovins.total > 1 ? 'boucles' : 'boucle'}
                            </p>
                            <p>Assignés à leurs personnes</p>
                        </div>

                        <div className="border-t border-base-content/15">
                            {bovins.data.map((bovin) => (
                                <article
                                    key={bovin.id}
                                    className="grid gap-4 border-b border-base-content/15 py-6 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] sm:items-center sm:gap-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <span
                                            aria-hidden="true"
                                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-base-content/15 bg-base-200 font-display text-sm text-base-content/60"
                                        >
                                            {bovin.sexe === 'male' ? '♂' : '♀'}
                                        </span>

                                        <div className="min-w-0">
                                            <p className="truncate font-display text-xl tracking-tight">
                                                {bovin.numero_boucle}
                                            </p>
                                            <p className="mt-0.5 text-xs text-base-content/55">
                                                {sexLabel(bovin.sexe)} · naissance{' '}
                                                {formatDate(bovin.date_naissance)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="min-w-0 ps-16 sm:ps-0">
                                        <p className="truncate text-sm font-medium">
                                            {bovin.quartier.name}
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-base-content/55">
                                            {bovin.quartier.commune.name} ·{' '}
                                            {bovin.quartier.commune.district.name}
                                        </p>
                                        <Link
                                            href={route(
                                                'personnes.show',
                                                bovin.proprietaire.id,
                                            )}
                                            className="mt-1 inline-block max-w-full truncate text-xs text-base-content/45 underline-offset-4 hover:text-primary hover:underline"
                                        >
                                            Propriétaire :{' '}
                                            {bovin.proprietaire.nom}
                                        </Link>
                                    </div>

                                    <div className="flex items-center gap-2 ps-16 sm:justify-end sm:ps-0">
                                        <span
                                            className={`badge border-0 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                                                bovin.date_deces
                                                    ? 'bg-base-content/10 text-base-content/55'
                                                    : 'bg-success/10 text-success'
                                            }`}
                                        >
                                            {bovin.date_deces
                                                ? 'Décédé'
                                                : 'Actif'}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {bovins.last_page > 1 && (
                            <nav
                                aria-label="Pagination des bovins"
                                className="mt-8 flex items-center justify-between gap-4"
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
                    <div className="mt-10 rounded-[2rem] border border-dashed border-base-content/20 px-6 py-14 text-center sm:px-12">
                        <p className="font-display text-3xl tracking-tight">
                            Aucune boucle au registre.
                        </p>
                        <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-base-content/55">
                            Inscrivez d'abord une personne, puis assignez-lui
                            une ou plusieurs bêtes. Le registre commence par
                            un propriétaire.
                        </p>
                        <div className="mt-7 flex flex-wrap justify-center gap-2">
                            <Link
                                href={route('personnes.create')}
                                className="btn btn-primary h-11 rounded-full px-6 text-sm font-semibold normal-case"
                            >
                                Ajouter une personne
                            </Link>
                            <Link
                                href={route('bovins.create')}
                                className="btn btn-outline h-11 rounded-full border-base-content/20 px-6 text-sm font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                            >
                                Enregistrer un bovin
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
