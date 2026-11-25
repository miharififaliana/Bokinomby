import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toLines } from '@/lib/lines';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

function formatDate(value) {
    if (!value) {
        return '—';
    }

    const [year, month, day] = value.slice(0, 10).split('-');

    return `${day}/${month}/${year}`;
}

function sexLabel(sexe, t) {
    return sexe === 'male' ? t('bovins.index.male') : t('bovins.index.female');
}

function DetailRow({ label, children }) {
    return (
        <div className="border-t border-base-content/15 py-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-base-content/45">
                {label}
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-base-content/80">
                {children}
            </dd>
        </div>
    );
}

export default function Show({ bovin, localisation, histories = [] }) {
    const { delete: destroy, processing: deleting } = useForm();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { t, locale } = useTranslation();

    const handleDelete = () => {
        destroy(route('bovins.destroy', bovin.id));
    };
    const reduceMotion = useReducedMotion();
    const estMort = Boolean(bovin.date_deces);
    const signes = toLines(bovin.signe_particulier);
    const sante = toLines(bovin.dossier_sante);
    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
        localisation.map_query,
    )}&z=10&output=embed`;
    const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        localisation.map_query,
    )}`;
    const lieu = [
        localisation.commune,
        localisation.district,
        localisation.region,
        localisation.province,
    ]
        .filter(Boolean)
        .join(' · ');

    return (
        <AuthenticatedLayout>
            <Head title={t('bovins.show.title') + ' ' + bovin.numero_boucle} />

            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Link
                        href={route('bovins.index')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-base-content/50 underline-offset-4 transition-colors hover:text-base-content hover:underline"
                    >
                        <span aria-hidden="true">←</span>
                        {t('bovins.show.back')}
                    </Link>

                    <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
                        <div>
                            <p className="text-sm text-base-content/45">
                                {t('bovins.show.eyebrow')}
                            </p>
                            <h1 className="mt-2 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
                                {bovin.numero_boucle}
                            </h1>
                            <p className="mt-3 text-sm text-base-content/55">
                                {t('bovins.show.boucleSex', {
                                    sex: sexLabel(bovin.sexe, t),
                                })}
                            </p>
                        </div>

                        <span
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
                                estMort
                                    ? 'border-base-content/15 bg-base-content/5 text-base-content/55'
                                    : 'border-success/25 bg-success/10 text-success'
                            }`}
                        >
                            <span
                                aria-hidden="true"
                                className={`h-2 w-2 rounded-full ${
                                    estMort ? 'bg-base-content/30' : 'bg-success'
                                }`}
                            />
                            {estMort
                                ? t('bovins.show.dead')
                                : t('bovins.show.alive')}
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href={route('bovins.edit', bovin.id)}
                                className="btn btn-outline h-10 rounded-full border-base-content/20 px-5 text-xs font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                            >
                                {t('bovins.show.edit')}
                            </Link>
                            <button
                                type="button"
                                onClick={() => setConfirmDelete(true)}
                                className="btn btn-error btn-outline h-10 rounded-full px-5 text-xs font-semibold normal-case"
                            >
                                {t('bovins.show.delete')}
                            </button>
                        </div>
                    </div>

                    {confirmDelete && (
                        <div className="mt-6 rounded-2xl border border-error/30 bg-error/10 px-5 py-4 text-sm text-base-content/70">
                            <p className="font-medium text-error">
                                {t('bovins.show.deleteTitle')}
                            </p>
                            <p className="mt-1 leading-relaxed">
                                {t('bovins.show.deleteText')}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={handleDelete}
                                    className="btn btn-error h-10 rounded-full px-5 text-sm font-semibold normal-case"
                                >
                                    {deleting
                                        ? t('bovins.show.deleting')
                                        : t('bovins.show.confirmDelete')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(false)}
                                    className="btn btn-ghost h-10 rounded-full px-5 text-sm font-semibold normal-case"
                                >
                                    {t('bovins.show.cancel')}
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>

                <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.08,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <section aria-labelledby="identite-heading">
                            <h2
                                id="identite-heading"
                                className="text-sm font-semibold text-base-content/45"
                            >
                                {t('bovins.show.identity')}
                            </h2>

                            <dl className="mt-2">
                                <DetailRow label={t('bovins.show.owner')}>
                                    <Link
                                        href={route(
                                            'utilisateurs.show',
                                            bovin.proprietaire.id,
                                        )}
                                        className="font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                        {bovin.proprietaire.name}
                                    </Link>
                                    {bovin.proprietaire.cin && (
                                        <span className="mt-1 block text-xs text-base-content/50">
                                            CIN {bovin.proprietaire.cin}
                                            {bovin.proprietaire.email
                                                ? ` · ${bovin.proprietaire.email}`
                                                : ''}
                                        </span>
                                    )}
                                </DetailRow>

                                <DetailRow label={t('bovins.show.earTag')}>
                                    <span className="font-display text-lg tracking-tight">
                                        {bovin.numero_boucle}
                                    </span>
                                </DetailRow>

                                <DetailRow label={t('bovins.show.sex')}>
                                    {sexLabel(bovin.sexe, t)}
                                </DetailRow>

                                <DetailRow label={t('bovins.show.birthDate')}>
                                    {formatDate(bovin.date_naissance)}
                                </DetailRow>

                                <DetailRow label={t('bovins.show.deathDate')}>
                                    {bovin.date_deces ? (
                                        formatDate(bovin.date_deces)
                                    ) : (
                                        <span className="text-base-content/50">
                                            {t('bovins.show.noDeath')}
                                        </span>
                                    )}
                                </DetailRow>

                                <DetailRow label={t('bovins.show.signs')}>
                                    {signes.length > 0 ? (
                                        <ul className="space-y-1">
                                            {signes.map((signe, index) => (
                                                <li
                                                    key={`${signe}-${index}`}
                                                    className="flex gap-2"
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary"
                                                    />
                                                    {signe}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-base-content/50">
                                            {t('bovins.show.noSigns')}
                                        </span>
                                    )}
                                </DetailRow>
                            </dl>
                        </section>

                        <section
                            aria-labelledby="sante-heading"
                            className="mt-10"
                        >
                            <h2
                                id="sante-heading"
                                className="text-sm font-semibold text-base-content/45"
                            >
                                {t('bovins.show.health')}
                            </h2>

                            {sante.length > 0 ? (
                                <ol className="mt-3 border-t border-base-content/15">
                                    {sante.map((note, index) => (
                                        <li
                                            key={`${note}-${index}`}
                                            className="flex gap-4 border-b border-base-content/15 py-4"
                                        >
                                            <span className="mt-0.5 font-display text-sm text-secondary">
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>
                                            <p className="text-sm leading-relaxed text-base-content/75">
                                                {note}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="mt-3 rounded-2xl border border-dashed border-base-content/20 px-5 py-6 text-sm leading-relaxed text-base-content/55">
                                    {t('bovins.show.noHealth')}
                                </p>
                            )}
                        </section>

                        <section
                            aria-labelledby="historique-heading"
                            className="mt-10"
                        >
                            <h2
                                id="historique-heading"
                                className="text-sm font-semibold text-base-content/45"
                            >
                                {t('bovins.show.history')}
                            </h2>

                            {histories.length > 0 ? (
                                <ol className="mt-3 border-t border-base-content/15">
                                    {histories.map((entry) => (
                                        <li
                                            key={entry.id}
                                            className="border-b border-base-content/15 py-4"
                                        >
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/45">
                                                {entry.action} ·{' '}
                                                {new Date(
                                                    entry.created_at,
                                                ).toLocaleDateString(
                                                    locale === 'mg'
                                                        ? 'mg'
                                                        : 'fr-FR',
                                                )}
                                                {entry.user?.name
                                                    ? ` · ${entry.user.name}`
                                                    : ''}
                                            </p>
                                            {entry.changes && (
                                                <ul className="mt-2 space-y-1 text-sm text-base-content/75">
                                                    {Object.entries(
                                                        entry.changes,
                                                    ).map(([field, value]) => (
                                                        <li key={field}>
                                                            <span className="font-medium">
                                                                {field}
                                                            </span>{' '}
                                                            :{' '}
                                                            {typeof value ===
                                                            'object' &&
                                                            value !== null &&
                                                            'avant' in value
                                                                ? `${JSON.stringify(
                                                                      value.avant,
                                                                  )} → ${JSON.stringify(
                                                                      value.apres,
                                                                  )}`
                                                                : JSON.stringify(
                                                                      value,
                                                                  )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="mt-3 rounded-2xl border border-dashed border-base-content/20 px-5 py-6 text-sm leading-relaxed text-base-content/55">
                                    {t('bovins.show.noHistory')}
                                </p>
                            )}
                        </section>
                    </motion.div>

                    <motion.aside
                        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.14,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="lg:sticky lg:top-24 lg:self-start"
                    >
                        <h2 className="text-sm font-semibold text-base-content/45">
                            {t('bovins.show.location')}
                        </h2>

                        <div className="mt-3 overflow-hidden rounded-2xl border border-base-content/15">
                            <iframe
                                title={t('bovins.show.mapTitle', {
                                    place: localisation.map_query,
                                })}
                                src={mapSrc}
                                className="h-64 w-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                            <div className="border-t border-base-content/15 bg-base-100 px-5 py-4">
                                <p className="text-sm font-medium">
                                    {localisation.commune ??
                                        t('bovins.show.unknownCommune')}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-base-content/55">
                                    {lieu || t('bovins.show.noLocation')}
                                </p>
                                {localisation.code_postal && (
                                    <p className="mt-1 text-xs text-base-content/45">
                                        {t('bovins.show.postalCode', {
                                            code: localisation.code_postal,
                                        })}
                                    </p>
                                )}
                                <a
                                    href={mapHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-block text-xs font-semibold text-primary underline-offset-4 hover:underline"
                                >
                                    {t('bovins.show.openMaps')}
                                </a>
                            </div>
                        </div>

                        <p className="mt-4 text-xs leading-relaxed text-base-content/45">
                            {t('bovins.show.mapNote')}
                        </p>
                    </motion.aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
