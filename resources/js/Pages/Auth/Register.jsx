import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        cin: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Créer un compte" />

            <div className="mb-8">
                <h1 className="font-display text-4xl tracking-tight">
                    Ouvrir un dossier
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                    Créez votre accès au registre. Vous pourrez y tenir les
                    fiches de votre cheptel, commune par commune.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Nom complet" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-2"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Adresse e-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="cin" value="Numéro CIN" />

                    <TextInput
                        id="cin"
                        name="cin"
                        value={data.cin}
                        className="mt-2 uppercase tracking-wide"
                        placeholder="101234567890"
                        maxLength={12}
                        autoComplete="off"
                        onChange={(e) => setData('cin', e.target.value)}
                        required
                    />

                    <InputError message={errors.cin} />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmer le mot de passe"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError message={errors.password_confirmation} />
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Création…' : 'Créer mon compte'}
                </PrimaryButton>
            </form>

            <p className="mt-8 border-t border-base-content/10 pt-6 text-sm text-base-content/55">
                Déjà inscrit ?{' '}
                <Link
                    href={route('login')}
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                    Se connecter
                </Link>
            </p>
        </GuestLayout>
    );
}
