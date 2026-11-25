import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import { toLines } from '@/lib/lines';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';

function formatDateInput(value) {
    if (!value) return '';
    return String(value).slice(0, 10);
}

export default function Edit({ bovin }) {
    const reduceMotion = useReducedMotion();
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        sexe: bovin.sexe ?? '',
        date_naissance: formatDateInput(bovin.date_naissance),
        date_deces: formatDateInput(bovin.date_deces),
        signe_particulier: toLines(bovin.signe_particulier).join('\n'),
        dossier_sante: toLines(bovin.dossier_sante).join('\n'),
    });

    const submit = (event) => {
        event.preventDefault();

        put(route('bovins.update', bovin.id));
    };

    const todayInputValue = () => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${today.getFullYear()}-${month}-${day}`;
    };

    return (
        <AuthenticatedLayout>
            <Head
                title={t('bovins.edit.title', {
                    boucle: bovin.numero_boucle,
                })}
            />

            <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Link
                        href={route('bovins.show', bovin.id)}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-base-content/50 underline-offset-4 transition-colors hover:text-base-content hover:underline"
                    >
                        <span aria-hidden="true">←</span>
                        {t('bovins.edit.back')}
                    </Link>

                    <p className="mt-8 text-sm text-base-content/45">
                        {t('bovins.edit.eyebrow')}
                    </p>
                    <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.03] tracking-[-0.02em]">
                        {t('bovins.edit.heading', {
                            boucle: bovin.numero_boucle,
                        })}
                    </h1>
                </motion.div>

                <motion.form
                    onSubmit={submit}
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.08,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-10 space-y-8"
                >
                    <fieldset>
                        <legend className="flex items-baseline gap-3 border-b border-base-content/15 pb-3">
                            <span className="font-display text-lg text-secondary">
                                01
                            </span>
                            <span className="text-sm font-semibold">
                                {t('bovins.edit.sex')}
                            </span>
                        </legend>

                        <div className="mt-7 grid grid-cols-2 gap-2">
                            {[
                                ['femelle', t('bovins.index.female')],
                                ['male', t('bovins.index.male')],
                            ].map(([value, label]) => (
                                <label
                                    key={value}
                                    className={`flex h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${
                                        data.sexe === value
                                            ? 'border-primary bg-primary text-primary-content'
                                            : 'border-base-content/20 bg-base-100 text-base-content/60 hover:border-base-content/40'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="sexe"
                                        value={value}
                                        checked={data.sexe === value}
                                        onChange={(event) =>
                                            setData('sexe', event.target.value)
                                        }
                                        className="sr-only"
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                        <InputError message={errors.sexe} />
                    </fieldset>

                    <fieldset>
                        <legend className="flex items-baseline gap-3 border-b border-base-content/15 pb-3">
                            <span className="font-display text-lg text-secondary">
                                02
                            </span>
                            <span className="text-sm font-semibold">
                                {t('bovins.edit.dates')}
                            </span>
                        </legend>

                        <div className="mt-7 grid gap-6 sm:grid-cols-2">
                            <div>
                                <InputLabel
                                    htmlFor="date_naissance"
                                    value={t('bovins.edit.birthDate')}
                                />
                                <TextInput
                                    id="date_naissance"
                                    type="date"
                                    value={data.date_naissance}
                                    max={todayInputValue()}
                                    className="mt-2"
                                    onChange={(event) =>
                                        setData(
                                            'date_naissance',
                                            event.target.value,
                                        )
                                    }
                                    required
                                />
                                <InputError message={errors.date_naissance} />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="date_deces"
                                    value={t('bovins.edit.deathDate')}
                                />
                                <TextInput
                                    id="date_deces"
                                    type="date"
                                    value={data.date_deces}
                                    min={data.date_naissance || undefined}
                                    className="mt-2"
                                    onChange={(event) =>
                                        setData('date_deces', event.target.value)
                                    }
                                />
                                <InputError message={errors.date_deces} />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className="flex items-baseline gap-3 border-b border-base-content/15 pb-3">
                            <span className="font-display text-lg text-secondary">
                                03
                            </span>
                            <span className="text-sm font-semibold">
                                {t('bovins.edit.signsHealth')}
                            </span>
                        </legend>

                        <div className="mt-7 grid gap-6">
                            <div>
                                <InputLabel
                                    htmlFor="signe_particulier"
                                    value={t('bovins.edit.signs')}
                                />
                                <textarea
                                    id="signe_particulier"
                                    value={data.signe_particulier}
                                    className="textarea textarea-bordered min-h-24 w-full rounded-xl border-base-content/20 bg-base-100 text-sm leading-relaxed focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Robe pie rouge\nCornes absentes"
                                    onChange={(event) =>
                                        setData(
                                            'signe_particulier',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.signe_particulier} />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="dossier_sante"
                                    value={t('bovins.edit.health')}
                                />
                                <textarea
                                    id="dossier_sante"
                                    value={data.dossier_sante}
                                    className="textarea textarea-bordered min-h-24 w-full rounded-xl border-base-content/20 bg-base-100 text-sm leading-relaxed focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Vaccination fièvre aphteuse — 12/03/2026"
                                    onChange={(event) =>
                                        setData(
                                            'dossier_sante',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.dossier_sante} />
                            </div>
                        </div>
                    </fieldset>

                    <div className="flex flex-wrap items-center gap-3 border-t border-base-content/15 pt-7">
                        <PrimaryButton disabled={processing}>
                            {processing
                                ? t('bovins.edit.saving')
                                : t('bovins.edit.submit')}
                        </PrimaryButton>
                        <Link
                            href={route('bovins.show', bovin.id)}
                            className="btn btn-ghost h-11 rounded-full px-5 text-sm font-semibold normal-case text-base-content/55 hover:bg-base-200 hover:text-base-content"
                        >
                            {t('bovins.edit.cancel')}
                        </Link>
                    </div>
                </motion.form>
            </div>
        </AuthenticatedLayout>
    );
}