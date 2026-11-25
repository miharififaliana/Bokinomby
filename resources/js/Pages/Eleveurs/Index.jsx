import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, useForm } from '@inertiajs/react';
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

export default function Index({ utilisateurs, filters, success }) {
    const reduceMotion = useReducedMotion();
    const { t } = useTranslation();
    const hasUtilisateurs = utilisateurs.data.length > 0;
    const search = filters?.search ?? '';
    const { data, setData, get, processing } = useForm({ search });

    const submit = (event) => {
        event.preventDefault();

        get(route('eleveurs.index'), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={t('eleveurs.index.title')} />

            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-sm text-base-content/45">
                        {t('eleveurs.index.eyebrow')}
                    </p>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
                                {t('eleveurs.index.heading')}
                            </h1>
                            <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-base-content/60">
                                {t('eleveurs.index.description')}
                            </p>
                        </div>

                        <Link
                            href={route('eleveurs.create')}
                            className="btn btn-primary h-11 rounded-full px-6 text-sm font-semibold normal-case"
                        >
                            {t('eleveurs.index.create')}
                        </Link>
                    </div>
                </motion.div>

                <form
                    onSubmit={submit}
                    className="mt-8 flex flex-wrap items-end gap-3 border-y border-base-content/15 py-5"
                >
                    <div className="min-w-0 flex-1">
                        <label
                            htmlFor="search"
                            className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-base-content/45"
                        >
                            {t('eleveurs.index.searchLabel')}
                        </label>
                        <input
                            id="search"
                            type="search"
                            value={data.search}
                            placeholder="101234567890"
                            className="input input-bordered mt-2 h-11 w-full rounded-xl border-base-content/20 bg-base-100 text-sm uppercase tracking-wide focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                            ? t('eleveurs.index.searching')
                            : t('eleveurs.index.search')}
                    </button>
                    {search && (
                        <Link
                            href={route('eleveurs.index')}
                            className="btn btn-ghost h-11 rounded-full px-5 text-sm font-semibold normal-case text-base-content/55 hover:bg-base-200 hover:text-base-content"
                        >
                            {t('eleveurs.index.reset')}
                        </Link>
                    )}
                </form>

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

                {hasUtilisateurs ? (
                    <>
                        <p className="mt-10 border-y border-base-content/15 py-4 text-xs text-base-content/45">
                            {t('eleveurs.index.count', {
                                from: utilisateurs.from,
                                to: utilisateurs.to,
                                total: utilisateurs.total,
                                label:
                                    utilisateurs.total > 1
                                        ? t('eleveurs.index.plural')
                                        : t('eleveurs.index.singular'),
                            })}
                        </p>

                        <div className="border-t border-base-content/15">
                            {utilisateurs.data.map((utilisateur) => (
                                <Link
                                    key={utilisateur.id}
                                    href={route(
                                        'utilisateurs.show',
                                        utilisateur.id,
                                    )}
                                    className="group grid gap-4 border-b border-base-content/15 py-5 transition-colors hover:bg-base-200/40 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xs text-primary-content">
                                            {initials(utilisateur.name)}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-display text-xl tracking-tight">
                                                {utilisateur.name}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-base-content/50">
                                                {t('eleveurs.show.cin')}{' '}
                                                {utilisateur.cin ||
                                                    t(
                                                        'eleveurs.index.cinMissing',
                                                    )}
                                                {utilisateur.email
                                                    ? ` · ${utilisateur.email}`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="min-w-0 ps-16 sm:ps-0">
                                        <p className="text-sm font-medium">
                                            {utilisateur.bovins_count}{' '}
                                            {utilisateur.bovins_count > 1
                                                ? t(
                                                      'eleveurs.index.bovinPlural',
                                                  )
                                                : t(
                                                      'eleveurs.index.bovinSingular',
                                                  )}
                                        </p>
                                        <p className="mt-0.5 text-xs text-base-content/45">
                                            {t('eleveurs.index.assigned')}
                                        </p>
                                    </div>

                                    <span className="text-xs font-semibold text-primary underline-offset-4 group-hover:underline sm:justify-self-end">
                                        {t('eleveurs.index.view')}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {utilisateurs.last_page > 1 && (
                            <nav
                                aria-label={t('eleveurs.index.pagination')}
                                className="mt-8 flex items-center justify-between gap-4"
                            >
                                                                    {utilisateurs.prev_page_url ? (
                                        <Link
                                            href={utilisateurs.prev_page_url}
                                            preserveScroll
                                            className="btn btn-outline h-10 rounded-full border-base-content/20 px-5 text-xs font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                                        >
                                            {t('eleveurs.index.previous')}
                                        </Link>
                                ) : (
                                    <span />
                                )}

                                <p className="text-xs text-base-content/45">
                                    {t('eleveurs.index.page', {
                                        current: utilisateurs.current_page,
                                        last: utilisateurs.last_page,
                                    })}
                                </p>

                                                                    {utilisateurs.next_page_url ? (
                                        <Link
                                            href={utilisateurs.next_page_url}
                                            preserveScroll
                                            className="btn btn-outline h-10 rounded-full border-base-content/20 px-5 text-xs font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                                        >
                                            {t('eleveurs.index.next')}
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
                                ? t('eleveurs.index.emptySearchTitle')
                                : t('eleveurs.index.emptyTitle')}
                        </p>
                        <p className="mx-auto mt-3 max-w-[44ch] text-sm leading-relaxed text-base-content/55">
                            {search
                                ? t('eleveurs.index.emptySearchText')
                                : t('eleveurs.index.emptyText')}
                        </p>
                        {search ? (
                            <Link
                                href={route('eleveurs.index')}
                                className="btn btn-outline mt-7 h-11 rounded-full border-base-content/20 px-6 text-sm font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                            >
                                {t('eleveurs.index.resetSearch')}
                            </Link>
                        ) : (
                            <Link
                                href={route('eleveurs.create')}
                                className="btn btn-primary mt-7 h-11 rounded-full px-6 text-sm font-semibold normal-case"
                            >
                                {t('eleveurs.index.addFirst')}
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
