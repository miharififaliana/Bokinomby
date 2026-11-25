import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/lib/i18n';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const { t } = useTranslation();

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="font-display text-2xl tracking-tight">
                    {t('profile.information.title')}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-base-content/55">
                    {t('profile.information.description')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-7 space-y-5">
                <div>
                    <InputLabel
                        htmlFor="name"
                        value={t('profile.information.name')}
                    />

                    <TextInput
                        id="name"
                        className="mt-2"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError message={errors.name} />
                </div>

                <div>
                    <InputLabel
                        htmlFor="email"
                        value={t('profile.information.email')}
                    />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-2"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl border border-warning/25 bg-warning/10 p-4">
                        <p className="text-sm text-base-content/75">
                            {t('profile.information.unverified')}{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-semibold text-primary underline-offset-4 hover:underline"
                            >
                                {t('profile.information.resend')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-success">
                                {t('profile.information.resent')}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-1">
                    <PrimaryButton disabled={processing}>
                        {processing
                            ? t('profile.information.saving')
                            : t('profile.information.save')}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-base-content/55">
                            {t('profile.information.saved')}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
