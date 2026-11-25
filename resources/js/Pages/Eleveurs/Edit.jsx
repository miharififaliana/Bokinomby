import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Edit({ utilisateur }) {
    const reduceMotion = useReducedMotion();
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: utilisateur.name ?? '',
        cin: utilisateur.cin ?? '',
        email: utilisateur.email ?? '',
    });

    const submit = (event) => {
        event.preventDefault();

        put(route('eleveurs.update', utilisateur.id));
    };

    return (
        <AuthenticatedLayout>
            <Head
                title={t('eleveurs.edit.title', { name: utilisateur.name })}
            />

            <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Link
                        href={route('eleveurs.show', utilisateur.id)}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-base-content/50 underline-offset-4 transition-colors hover:text-base-content hover:underline"
                    >
                        <span aria-hidden="true">←</span>
                        {t('eleveurs.edit.back')}
                    </Link>

                    <p className="mt-8 text-sm text-base-content/45">
                        {t('eleveurs.edit.eyebrow')}
                    </p>
                    <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.03] tracking-[-0.02em]">
                        {t('eleveurs.edit.heading', {
                            name: utilisateur.name,
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
                    className="mt-10 space-y-6"
                >
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value={t('eleveurs.edit.name')}
                            />
                            <TextInput
                                id="name"
                                value={data.name}
                                className="mt-2"
                                autoComplete="name"
                                isFocused
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="cin"
                                value={t('eleveurs.edit.cin')}
                            />
                            <TextInput
                                id="cin"
                                value={data.cin}
                                className="mt-2 font-medium uppercase tracking-wide"
                                placeholder="101234567890"
                                maxLength={12}
                                autoComplete="off"
                                onChange={(event) =>
                                    setData('cin', event.target.value)
                                }
                                required
                            />
                            <InputError message={errors.cin} />
                        </div>
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="email"
                            value={t('eleveurs.edit.email')}
                        />
                        <TextInput
                            id="email"
                            type="email"
                            value={data.email}
                            className="mt-2"
                            placeholder="nom@example.com"
                            autoComplete="email"
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-base-content/15 pt-7">
                        <PrimaryButton disabled={processing}>
                            {processing
                                ? t('eleveurs.edit.saving')
                                : t('eleveurs.edit.submit')}
                        </PrimaryButton>
                        <Link
                            href={route('eleveurs.show', utilisateur.id)}
                            className="btn btn-ghost h-11 rounded-full px-5 text-sm font-semibold normal-case text-base-content/55 hover:bg-base-200 hover:text-base-content"
                        >
                            {t('eleveurs.edit.cancel')}
                        </Link>
                    </div>
                </motion.form>
            </div>
        </AuthenticatedLayout>
    );
}