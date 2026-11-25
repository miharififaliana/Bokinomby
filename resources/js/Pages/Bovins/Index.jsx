import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';

function formatDate(value) {
    if (!value) {
        return '—';
    }

    const [year, month, day] = value.slice(0, 10).split('-');

    return `${day}/${month}/${year}`;
}

export default function Index({ bovins, stats, filters, success }) {
    const reduceMotion = useReducedMotion();
    const { t } = useTranslation();
    const hasBovins = bovins.data.length > 0;
    const search = filters?.search ?? '';
    const { data, setData, get, processing } = useForm({ search });

    const sexLabel = (sexe) =>
        sexe === 'male' ? t('bovins.index.male') : t('bovins.index.female');

    const submit = (event) => {
        event.preventDefault();

        get(route('bovins.index'), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={t('bovins.index.title')} />

            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-sm text-base-content/45">
                        {t('bovins.index.eyebrow')}
                    </p>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
                                {t('bovins.index.heading')}
                            </h1>
                            <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-base-content/60">
                                {t('bovins.index.description')}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href={route('eleveurs.index')}
                                className="btn btn-outline h-11 rounded-full border-base-content/20 px-6 text-sm font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                            >
                                {t('bovins.index.breeders')}
                            </Link>
                            <Link
                                href={route('bovins.create')}
                                className="btn btn-primary h-11 rounded-full px-6 text-sm font-semibold normal-case"
                            >
                                {t('bovins.index.create')}
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

                <form
                    onSubmit={submit}
                    className="mt-8 flex flex-wrap items-end gap-3 border-y border-base-content/15 py-5"
                >
                    <div className="min-w-0 flex-1">
                        <label
                            htmlFor="search"
                            className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-base-content/45"
                        >
                            {t('bovins.index.searchLabel')}
                        </label>
                        <input
                            id="search"
                            type="search"
                            value={data.search}
                            placeholder={t('bovins.index.searchPlaceholder')}
                            className="input input-bordered mt-2 h-11 w-full rounded-xl border-base-content/20 bg-base-100 text-sm font-medium tracking-wide focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            onChange={(event) =>
                                setData('search', event.target.value)
                            }
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary h-11 rounded-full px-6 text-sm font-semibold normal-case"
                    >
                        {processing
                            ? t('bovins.index.searching')
                            : t('bovins.index.search')}
                    </button>
                    {search && (
                        <Link
                            href={route('bovins.index')}
                            className="btn btn-ghost h-11 rounded-full px-5 text-sm font-semibold normal-case text-base-content/55 hover:bg-base-200 hover:text-base-content"
                        >
                            {t('bovins.index.reset')}
                        </Link>
                    )}
                </form>

                <dl className="mt-10 grid grid-cols-3 border-y border-base-content/15">
                    {[
                        [t('bovins.index.statsTotal'), stats.total],
                        [t('bovins.index.statsFemelles'), stats.femelles],
                        [t('bovins.index.statsMales'), stats.males],
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
                                {t('bovins.index.count', {
                                    from: bovins.from,
                                    to: bovins.to,
                                    total: bovins.total,
                                    label:
                                        bovins.total > 1
                                            ? t('bovins.index.bovinPlural')
                                            : t('bovins.index.bovinSingular'),
                                })}
                            </p>
                            <p>{t('bovins.index.assigned')}</p>
                        </div>

                        <div className="border-t border-base-content/15">
                            {bovins.data.map((bovin) => (
                                <Link
                                    key={bovin.id}
                                    href={route('bovins.show', bovin.id)}
                                    className="grid gap-4 border-b border-base-content/15 py-6 transition-colors hover:bg-base-200/40 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] sm:items-center sm:gap-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <span
                                            aria-hidden="true"
                                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-base-content/15 bg-base-200 font-display text-sm text-base-content/60"
                                        >
                                            {bovin.sexe === 'male' ? '♂' : '♀'}
                                        </span>

                                        <div className="min-w-0">
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-base-content/45">
                                                {t('bovins.index.boucle')}
                                            </p>
                                            <p className="truncate font-display text-xl tracking-tight">
                                                {bovin.numero_boucle}
                                            </p>
                                            <p className="mt-0.5 truncate text-sm font-medium text-base-content/70">
                                                {bovin.proprietaire.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-base-content/55">
                                                {sexLabel(bovin.sexe)} ·{' '}
                                                {t('bovins.index.born')}{' '}
                                                {formatDate(
                                                    bovin.date_naissance,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="min-w-0 ps-16 sm:ps-0">
                                        <p className="truncate text-sm font-medium">
                                            {bovin.commune?.name ?? '—'}
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-base-content/55">
                                            {bovin.commune?.district?.name ??
                                                '—'}{' '}
                                            ·{' '}
                                            {bovin.commune?.district?.region
                                                ?.nom ?? '—'}
                                        </p>
                                        <p className="mt-1 text-xs text-base-content/45">
                                            {t('bovins.index.viewRecord')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 ps-16 sm:justify-end sm:ps-0">
                                        <span
                                            className={`inline-flex items-center gap-2 text-xs font-semibold ${
                                                bovin.date_deces
                                                    ? 'text-base-content/45'
                                                    : 'text-success'
                                            }`}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`h-2 w-2 rounded-full ${
                                                    bovin.date_deces
                                                        ? 'bg-base-content/30'
                                                        : 'bg-success'
                                                }`}
                                            />
                                            {bovin.date_deces
                                                ? t('bovins.index.dead')
                                                : t('bovins.index.alive')}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {bovins.last_page > 1 && (
                            <nav
                                aria-label={t('bovins.index.title')}
                                className="mt-8 flex items-center justify-between gap-4"
                            >
                                {bovins.prev_page_url ? (
                                    <Link
                                        href={bovins.prev_page_url}
                                        preserveScroll
                                        className="btn btn-outline h-10 rounded-full border-base-content/20 px-5 text-xs font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                                    >
                                        {t('bovins.index.previous')}
                                    </Link>
                                ) : (
                                    <span />
                                )}

                                <p className="text-xs text-base-content/45">
                                    {t('bovins.index.page', {
                                        current: bovins.current_page,
                                        last: bovins.last_page,
                                    })}
                                </p>

                                {bovins.next_page_url ? (
                                    <Link
                                        href={bovins.next_page_url}
                                        preserveScroll
                                        className="btn btn-outline h-10 rounded-full border-base-content/20 px-5 text-xs font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                                    >
                                        {t('bovins.index.next')}
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
                            {search
                                ? t('bovins.index.emptySearchTitle')
                                : t('bovins.index.emptyTitle')}
                        </p>
                        <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-base-content/55">
                            {search
                                ? t('bovins.index.emptySearchText')
                                : t('bovins.index.emptyText')}
                        </p>
                        <div className="mt-7 flex flex-wrap justify-center gap-2">
                            {search ? (
                                <Link
                                    href={route('bovins.index')}
                                    className="btn btn-outline h-11 rounded-full border-base-content/20 px-6 text-sm font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                                >
                                    {t('bovins.index.resetSearch')}
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('eleveurs.create')}
                                        className="btn btn-primary h-11 rounded-full px-6 text-sm font-semibold normal-case"
                                    >
                                        {t('bovins.index.addUser')}
                                    </Link>
                                    <Link
                                        href={route('bovins.create')}
                                        className="btn btn-outline h-11 rounded-full border-base-content/20 px-6 text-sm font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                                    >
                                        {t('bovins.index.create')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
