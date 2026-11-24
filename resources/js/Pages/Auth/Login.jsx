import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            <div className="mb-8">
                <h1 className="font-display text-4xl tracking-tight">
                    Se connecter
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                    Reprenez la tenue du registre et retrouvez les dossiers de
                    votre cheptel.
                </p>
            </div>

            {status && (
                <div className="alert mb-6 rounded-xl border border-success/25 bg-success/10 py-3 text-sm text-success">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Adresse e-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} />
                </div>

                <div>
                    <div className="flex items-baseline justify-between gap-4">
                        <InputLabel
                            htmlFor="password"
                            value="Mot de passe"
                        />

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-medium text-base-content/55 underline-offset-4 hover:text-primary hover:underline"
                            >
                                Mot de passe oublié ?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} />
                </div>

                <label className="flex items-center gap-2.5">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className="text-sm text-base-content/65">
                        Se souvenir de moi
                    </span>
                </label>

                <PrimaryButton
                    className="w-full"
                    disabled={processing}
                >
                    {processing ? 'Connexion…' : 'Se connecter'}
                </PrimaryButton>
            </form>

            <p className="mt-8 border-t border-base-content/10 pt-6 text-sm text-base-content/55">
                Pas encore de compte ?{' '}
                <Link
                    href={route('register')}
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                    Ouvrir un dossier
                </Link>
            </p>
        </GuestLayout>
    );
}
