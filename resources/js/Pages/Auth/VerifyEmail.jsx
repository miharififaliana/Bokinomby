import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Vérifier votre e-mail" />

            <div className="mb-8">
                <h1 className="font-display text-4xl tracking-tight">
                    Vérifier votre e-mail
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                    Cliquez sur le lien envoyé à votre adresse e-mail pour
                    activer votre accès. S'il n'est pas arrivé, demandez-en un
                    nouveau.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="alert mb-6 rounded-xl border border-success/25 bg-success/10 py-3 text-sm text-success">
                    Un nouveau lien de vérification vient d'être envoyé.
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Envoi…' : 'Renvoyer le lien'}
                </PrimaryButton>

                <p className="border-t border-base-content/10 pt-6 text-sm">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="font-medium text-base-content/55 underline-offset-4 hover:text-primary hover:underline"
                    >
                        Se déconnecter
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
