import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="font-display text-2xl tracking-tight">
                    Mot de passe
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-base-content/55">
                    Utilisez un mot de passe long et unique pour protéger votre
                    accès au registre.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-7 space-y-5">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Mot de passe actuel"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="mt-2"
                        autoComplete="current-password"
                    />

                    <InputError message={errors.current_password} />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Nouveau mot de passe"
                    />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-2"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmer le nouveau mot de passe"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="mt-2"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password_confirmation} />
                </div>

                <div className="flex items-center gap-4 pt-1">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Mise à jour…' : 'Mettre à jour'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-base-content/55">
                            Enregistré.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
