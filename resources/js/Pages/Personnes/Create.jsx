import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Create() {
    const reduceMotion = useReducedMotion();
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        telephone: '',
        email: '',
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('personnes.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Ajouter une personne" />

            <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Link
                        href={route('personnes.index')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-base-content/50 underline-offset-4 transition-colors hover:text-base-content hover:underline"
                    >
                        <span aria-hidden="true">←</span>
                        Retour aux personnes
                    </Link>

                    <p className="mt-8 text-sm text-base-content/45">
                        Nouveau propriétaire
                    </p>
                    <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.03] tracking-[-0.02em]">
                        Inscrire une personne.
                    </h1>
                    <p className="mt-4 max-w-[54ch] text-sm leading-relaxed text-base-content/60">
                        Un nom suffit pour ouvrir sa fiche. Aucun compte de
                        connexion n'est nécessaire : vous pourrez ensuite lui
                        assigner plusieurs bovins.
                    </p>
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
                    <div>
                        <InputLabel htmlFor="nom" value="Nom complet" />
                        <TextInput
                            id="nom"
                            value={data.nom}
                            className="mt-2"
                            autoComplete="name"
                            isFocused
                            onChange={(event) =>
                                setData('nom', event.target.value)
                            }
                            required
                        />
                        <InputError message={errors.nom} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <InputLabel
                                htmlFor="telephone"
                                value="Téléphone (facultatif)"
                            />
                            <TextInput
                                id="telephone"
                                type="tel"
                                value={data.telephone}
                                className="mt-2"
                                placeholder="+243 81 000 0000"
                                autoComplete="tel"
                                onChange={(event) =>
                                    setData('telephone', event.target.value)
                                }
                            />
                            <InputError message={errors.telephone} />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="E-mail (facultatif)"
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
                            />
                            <InputError message={errors.email} />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-base-content/15 pt-7">
                        <PrimaryButton disabled={processing}>
                            {processing
                                ? 'Enregistrement…'
                                : 'Ajouter la personne'}
                        </PrimaryButton>
                        <Link
                            href={route('personnes.index')}
                            className="btn btn-ghost h-11 rounded-full px-5 text-sm font-semibold normal-case text-base-content/55 hover:bg-base-200 hover:text-base-content"
                        >
                            Annuler
                        </Link>
                    </div>
                </motion.form>
            </div>
        </AuthenticatedLayout>
    );
}
