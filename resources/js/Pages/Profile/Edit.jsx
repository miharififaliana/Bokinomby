import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const reduceMotion = useReducedMotion();

    return (
        <AuthenticatedLayout>
            <Head title="Profil" />

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
                            Votre dossier
                        </h1>
                        <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-base-content/60">
                            Les informations qui accompagnent votre accès au
                            registre bovin.
                        </p>
                    </motion.header>

                    <div className="grid gap-6 lg:grid-cols-2">
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
