import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Mot de passe oublié" />

            <div className="mb-8">
                <h1 className="font-display text-4xl tracking-tight">
                    Mot de passe oublié
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                    Indiquez l'adresse e-mail de votre compte. Nous vous
                    enverrons un lien pour choisir un nouveau mot de passe.
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

                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Envoi…' : 'Envoyer le lien'}
                </PrimaryButton>
            </form>

            <p className="mt-8 border-t border-base-content/10 pt-6 text-sm">
                <Link
                    href={route('login')}
                    className="font-medium text-base-content/55 underline-offset-4 hover:text-primary hover:underline"
                >
                    Retour à la connexion
                </Link>
            </p>
        </GuestLayout>
    );
}
