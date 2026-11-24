import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="font-display text-2xl tracking-tight text-error">
                    Supprimer le compte
                </h2>

                <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-base-content/60">
                    La suppression est définitive. Les données rattachées à
                    votre compte seront perdues. Téléchargez ce que vous
                    souhaitez conserver avant de continuer.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Supprimer mon compte
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 sm:p-8">
                    <h2 className="font-display text-2xl tracking-tight">
                        Confirmer la suppression
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-base-content/60">
                        Cette action est irréversible. Saisissez votre mot de
                        passe pour supprimer définitivement votre compte.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Mot de passe"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-full"
                            isFocused
                            placeholder="Votre mot de passe"
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="mt-7 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            Annuler
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            {processing
                                ? 'Suppression…'
                                : 'Supprimer définitivement'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
