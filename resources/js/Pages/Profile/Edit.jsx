import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePreferences, useTranslation } from '@/lib/i18n';
import { Head } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

function ChoiceButton({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${
                active
                    ? 'border-primary bg-primary text-primary-content'
                    : 'border-base-content/20 bg-base-100 text-base-content/60 hover:border-base-content/40'
            }`}
        >
            {children}
        </button>
    );
}

function SunIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path d="M10 2.5a1 1 0 011 1V5a1 1 0 11-2 0V3.5a1 1 0 011-1zm0 3.5a4 4 0 100 8 4 4 0 000-8zM10 15a1 1 0 011 1v1.5a1 1 0 11-2 0V16a1 1 0 011-1zm7.5-6a1 1 0 010 2H16a1 1 0 110-2h1.5zM4 10a1 1 0 01-1 1H1.5a1 1 0 110-2H3a1 1 0 011 1zm11.3-5.3a1 1 0 010 1.4l-1 1.1a1 1 0 11-1.5-1.4l1.1-1.1a1 1 0 011.4 0zM6.2 13.8a1 1 0 010 1.4L5.1 16.3a1 1 0 11-1.4-1.4l1-1.1a1 1 0 011.5 0zm9.1 2.5a1 1 0 01-1.4 0l-1.1-1a1 1 0 111.4-1.5l1.1 1.1a1 1 0 010 1.4zM6.2 6.2a1 1 0 01-1.4 0L3.7 5.1a1 1 0 011.4-1.4l1.1 1a1 1 0 010 1.5z" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path d="M10.5 2a8 8 0 107.5 10.5A6.5 6.5 0 0110.5 2z" />
        </svg>
    );
}

export default function Edit({ mustVerifyEmail, status }) {
    const reduceMotion = useReducedMotion();
    const { theme, setTheme, locale, setLocale } = usePreferences();
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <Head title={t('profile.title')} />

            <div className="min-h-[calc(100vh-72px)] bg-base-200/50">
                <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                    <motion.header
                        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mb-10"
                    >
                        <h1 className="font-display text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.03] tracking-[-0.02em]">
                            {t('profile.title')}
                        </h1>
                        <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-base-content/60">
                            {t('profile.subtitle')}
                        </p>
                    </motion.header>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <section className="rounded-[28px] border border-base-content/10 bg-base-100 p-6 sm:p-8 lg:col-span-2">
                            <header>
                                <h2 className="font-display text-2xl tracking-tight">
                                    {t('profile.preferences.title')}
                                </h2>
                                <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-base-content/55">
                                    {t('profile.preferences.description')}
                                </p>
                            </header>

                            <div className="mt-7 grid gap-8 sm:grid-cols-2">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-base-content/45">
                                        {t('profile.preferences.theme')}
                                    </p>
                                    <div className="mt-2 flex gap-2">
                                        <ChoiceButton
                                            active={theme === 'light'}
                                            onClick={() => setTheme('light')}
                                        >
                                            <SunIcon />
                                            {t('profile.preferences.light')}
                                        </ChoiceButton>
                                        <ChoiceButton
                                            active={theme === 'dark'}
                                            onClick={() => setTheme('dark')}
                                        >
                                            <MoonIcon />
                                            {t('profile.preferences.dark')}
                                        </ChoiceButton>
                                    </div>
                                    <p className="mt-2 text-xs text-base-content/45">
                                        {t(
                                            'profile.preferences.themeDescription',
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-base-content/45">
                                        {t('profile.preferences.language')}
                                    </p>
                                    <div className="mt-2 flex gap-2">
                                        <ChoiceButton
                                            active={locale === 'fr'}
                                            onClick={() => setLocale('fr')}
                                        >
                                            {t('profile.preferences.french')}
                                        </ChoiceButton>
                                        <ChoiceButton
                                            active={locale === 'mg'}
                                            onClick={() => setLocale('mg')}
                                        >
                                            {t('profile.preferences.malagasy')}
                                        </ChoiceButton>
                                    </div>
                                    <p className="mt-2 text-xs text-base-content/45">
                                        {t(
                                            'profile.preferences.languageDescription',
                                        )}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-base-content/10 bg-base-100 p-6 sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </section>

                        <section
                            id="password"
                            className="scroll-mt-28 rounded-[28px] border border-base-content/10 bg-base-100 p-6 sm:p-8"
                        >
                            <UpdatePasswordForm className="max-w-xl" />
                        </section>

                        <section className="rounded-[28px] border border-error/20 bg-error/[0.04] p-6 sm:p-8 lg:col-span-2">
                            <DeleteUserForm className="max-w-2xl" />
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
