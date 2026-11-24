import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';

export default function GuestLayout({ children }) {
    const reduceMotion = useReducedMotion();

    return (
        <div className="min-h-screen bg-base-100 lg:grid lg:grid-cols-[0.92fr_1.08fr]">
            <aside className="relative hidden overflow-hidden bg-primary p-12 text-primary-content lg:flex lg:flex-col lg:justify-between">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-40 -right-32 h-[34rem] w-[26rem] rotate-6 rounded-[4rem] border border-primary-content/15"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-56 rotate-12 rounded-[3rem] border border-secondary/40"
                />

                <Link href="/" className="relative flex items-center gap-3">
                    <ApplicationLogo className="h-10 w-auto text-primary-content" />
                    <span className="font-display text-2xl">Bokinomby</span>
                </Link>

                <div className="relative max-w-sm">
                    <p className="font-display text-4xl leading-[1.05]">
                        Une bête sans dossier est une bête sans histoire.
                    </p>
                    <p className="mt-6 text-sm leading-relaxed text-primary-content/70">
                        Identifiez chaque animal, rattachez-le à sa commune et
                        gardez son suivi sanitaire au même endroit.
                    </p>
                </div>

                <p className="relative text-xs tracking-[0.14em] text-primary-content/50">
                    REGISTRE BOVIN · KINSHASA
                </p>
            </aside>

            <main className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-10 flex items-center justify-between lg:hidden">
                        <Link href="/" className="flex items-center gap-2.5">
                            <ApplicationLogo className="h-9 w-auto text-primary" />
                            <span className="font-display text-xl">
                                Bokinomby
                            </span>
                        </Link>
                        <span className="text-[11px] tracking-[0.14em] text-base-content/45">
                            REGISTRE BOVIN
                        </span>
                    </div>

                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
