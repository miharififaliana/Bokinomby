import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirmer votre mot de passe" />

            <div className="mb-8">
                <h1 className="font-display text-4xl tracking-tight">
                    Espace sécurisé
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                    Confirmez votre mot de passe avant de poursuivre.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2"
                        isFocused={true}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} />
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Vérification…' : 'Confirmer'}
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
