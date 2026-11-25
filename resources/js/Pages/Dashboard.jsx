import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const currentYear = new Date().getFullYear();

function initials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

const DISTRIBUTION_LIMIT = 8;

function DistributionList({ labels, counts, t }) {
    const [expanded, setExpanded] = useState(false);
    const rows = labels
        .map((label, index) => ({ label, count: counts[index] ?? 0 }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    const total = rows.reduce((sum, row) => sum + row.count, 0);
    const max = Math.max(...rows.map((row) => row.count), 1);
    const visible = expanded ? rows : rows.slice(0, DISTRIBUTION_LIMIT);

    return (
        <div className="mt-6">
            <ol className="divide-y divide-base-content/10 border-t border-base-content/10">
                {visible.map((row) => {
                    const share = total
                        ? Math.round((row.count / total) * 100)
                        : 0;

                    return (
                        <li key={row.label} className="py-2.5">
                            <div className="flex items-baseline justify-between gap-4">
                                <span
                                    className="truncate text-sm"
                                    title={row.label}
                                >
                                    {row.label}
                                </span>
                                <span className="shrink-0 text-xs tabular-nums text-base-content/55">
                                    {row.count}
                                    <span className="text-base-content/35">
                                        {' · '}
                                        {share}%
                                    </span>
                                </span>
                            </div>
                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-base-200">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{
                                        width: `${Math.max(
                                            (row.count / max) * 100,
                                            row.count ? 2 : 0,
                                        )}%`,
                                    }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ol>

            {rows.length > DISTRIBUTION_LIMIT && (
                <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    className="mt-4 text-xs font-semibold text-primary underline-offset-4 hover:underline"
                >
                    {expanded
                        ? t('dashboard.distribution.showLess')
                        : t('dashboard.distribution.showAll', {
                              count: rows.length,
                          })}
                </button>
            )}
        </div>
    );
}

function VitalChart({ years, born, deaths, metric, t }) {
    const showBorn = metric !== 'deaths';
    const showDeaths = metric !== 'born';
    const relevant = years.map((_, index) => {
        let max = 0;
        if (showBorn) max = Math.max(max, born[index] ?? 0);
        if (showDeaths) max = Math.max(max, deaths[index] ?? 0);
        return max;
    });
    const max = Math.max(...relevant, 1);

    return (
        <div className="mt-6 overflow-x-auto">
            <div className="flex items-end gap-3" style={{ minHeight: '12rem' }}>
                {years.map((year, index) => {
                    const bornValue = born[index] ?? 0;
                    const deathValue = deaths[index] ?? 0;
                    const bornHeight = Math.round((bornValue / max) * 100);
                    const deathHeight = Math.round((deathValue / max) * 100);

                    return (
                        <div
                            key={year}
                            className="flex min-w-[3.5rem] flex-col items-center justify-end"
                        >
                            <div className="mb-1 flex gap-1 text-[10px] font-medium">
                                {showBorn && (
                                    <span className="text-success">
                                        {bornValue}
                                    </span>
                                )}
                                {showDeaths && (
                                    <span className="text-error">
                                        {deathValue}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-end gap-1">
                                {showBorn && (
                                    <div
                                        className="w-4 rounded-t-md bg-success transition-all"
                                        style={{
                                            height: `${Math.max(
                                                bornHeight,
                                                bornValue ? 6 : 2,
                                            )}%`,
                                            minHeight: bornValue
                                                ? '0.375rem'
                                                : '0.125rem',
                                        }}
                                    />
                                )}
                                {showDeaths && (
                                    <div
                                        className="w-4 rounded-t-md bg-error transition-all"
                                        style={{
                                            height: `${Math.max(
                                                deathHeight,
                                                deathValue ? 6 : 2,
                                            )}%`,
                                            minHeight: deathValue
                                                ? '0.375rem'
                                                : '0.125rem',
                                        }}
                                    />
                                )}
                            </div>
                            <span className="mt-2 text-[10px] text-base-content/55">
                                {year}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-base-content/60">
                {showBorn && (
                    <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-success" />
                        {t('dashboard.evolution.born')}
                    </span>
                )}
                {showDeaths && (
                    <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-error" />
                        {t('dashboard.evolution.deaths')}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const reduceMotion = useReducedMotion();
    const { t } = useTranslation();
    const firstName = user.name.split(' ')[0];

    const [geoLevel, setGeoLevel] = useState('province');
    const [geo, setGeo] = useState({ labels: [], counts: [] });
    const [geoLoading, setGeoLoading] = useState(false);

    const [metric, setMetric] = useState('both');
    const [startYear, setStartYear] = useState(currentYear - 4);
    const [endYear, setEndYear] = useState(currentYear);
    const [vital, setVital] = useState({
        years: [],
        born: [],
        deaths: [],
        metric: 'both',
    });
    const [vitalLoading, setVitalLoading] = useState(false);
    const [vitalError, setVitalError] = useState('');

    useEffect(() => {
        let active = true;
        setGeoLoading(true);
        axios
            .get(route('dashboard.geo'), { params: { level: geoLevel } })
            .then((response) => {
                if (active) setGeo(response.data);
            })
            .finally(() => {
                if (active) setGeoLoading(false);
            });
        return () => {
            active = false;
        };
    }, [geoLevel]);

    const loadVital = () => {
        if (startYear > endYear) {
            setVitalError(t('dashboard.evolution.startAfterEnd'));
            return;
        }
        setVitalError('');
        setVitalLoading(true);
        axios
            .get(route('dashboard.vital'), {
                params: {
                    metric,
                    start_year: startYear,
                    end_year: endYear,
                },
            })
            .then((response) => setVital(response.data))
            .finally(() => setVitalLoading(false));
    };

    useEffect(() => {
        loadVital();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title={t('dashboard.title')} />

            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-sm text-base-content/45">
                        {t('dashboard.eyebrow')}
                    </p>
                    <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
                        {t('dashboard.greeting', { name: firstName })}
                    </h1>
                    <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-base-content/60">
                        {t('dashboard.description')}
                    </p>
                </motion.div>

                <section className="mt-12 rounded-[2rem] border border-base-content/15 bg-base-100 p-6 sm:p-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="text-sm font-semibold text-base-content/45">
                                {t('dashboard.distribution.title')}
                            </h2>
                            <p className="mt-1 text-xs text-base-content/55">
                                {t('dashboard.distribution.description')}
                            </p>
                        </div>
                        <select
                            value={geoLevel}
                            onChange={(event) =>
                                setGeoLevel(event.target.value)
                            }
                            className="select select-bordered h-11 rounded-xl border-base-content/20 bg-base-100 text-sm"
                        >
                            <option value="province">
                                {t('dashboard.distribution.province')}
                            </option>
                            <option value="region">
                                {t('dashboard.distribution.region')}
                            </option>
                            <option value="district">
                                {t('dashboard.distribution.district')}
                            </option>
                        </select>
                    </div>

                    {geoLoading ? (
                        <p className="mt-8 text-sm text-base-content/55">
                            {t('dashboard.loading')}
                        </p>
                    ) : geo.labels.length === 0 ? (
                        <p className="mt-8 text-sm text-base-content/55">
                            {t('dashboard.noData')}
                        </p>
                    ) : (
                        <DistributionList
                            key={geoLevel}
                            labels={geo.labels}
                            counts={geo.counts}
                            t={t}
                        />
                    )}
                </section>

                <section className="mt-8 rounded-[2rem] border border-base-content/15 bg-base-100 p-6 sm:p-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="text-sm font-semibold text-base-content/45">
                                {t('dashboard.evolution.title')}
                            </h2>
                            <p className="mt-1 text-xs text-base-content/55">
                                {t('dashboard.evolution.description')}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-end gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-base-content/45">
                                    {t('dashboard.evolution.metric')}
                                </label>
                                <select
                                    value={metric}
                                    onChange={(event) =>
                                        setMetric(event.target.value)
                                    }
                                    className="select select-bordered mt-2 h-11 rounded-xl border-base-content/20 bg-base-100 text-sm"
                                >
                                    <option value="born">
                                        {t('dashboard.evolution.born')}
                                    </option>
                                    <option value="deaths">
                                        {t('dashboard.evolution.deaths')}
                                    </option>
                                    <option value="both">
                                        {t('dashboard.evolution.both')}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-base-content/45">
                                    {t('dashboard.evolution.from')}
                                </label>
                                <input
                                    type="number"
                                    value={startYear}
                                    onChange={(event) =>
                                        setStartYear(
                                            Number(event.target.value),
                                        )
                                    }
                                    className="input input-bordered mt-2 h-11 w-24 rounded-xl border-base-content/20 bg-base-100 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-base-content/45">
                                    {t('dashboard.evolution.to')}
                                </label>
                                <input
                                    type="number"
                                    value={endYear}
                                    onChange={(event) =>
                                        setEndYear(Number(event.target.value))
                                    }
                                    className="input input-bordered mt-2 h-11 w-24 rounded-xl border-base-content/20 bg-base-100 text-sm"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={loadVital}
                                disabled={vitalLoading}
                                className="btn btn-primary h-11 rounded-full px-6 text-sm font-semibold normal-case"
                            >
                                {vitalLoading
                                    ? t('dashboard.loading')
                                    : t('dashboard.evolution.update')}
                            </button>
                        </div>
                    </div>

                    {vitalError && (
                        <p className="mt-4 text-sm text-error">
                            {vitalError}
                        </p>
                    )}

                    {vitalLoading ? (
                        <p className="mt-8 text-sm text-base-content/55">
                            {t('dashboard.loading')}
                        </p>
                    ) : vital.years.length === 0 ? (
                        <p className="mt-8 text-sm text-base-content/55">
                            {t('dashboard.noData')}
                        </p>
                    ) : (
                        <VitalChart
                            years={vital.years}
                            born={vital.born}
                            deaths={vital.deaths}
                            metric={metric}
                            t={t}
                        />
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
