import ApplicationLogo from '@/Components/ApplicationLogo';
import EarTag from '@/Components/EarTag';
import { Head, Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Welcome({ auth }) {
    const reduceMotion = useReducedMotion();

    const heroVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
    };

    const itemVariants = reduceMotion
        ? {}
        : {
              hidden: { opacity: 0, y: 18 },
              visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
              },
          };

    const primaryHref = auth.user ? route('bovins.index') : route('register');
    const primaryLabel = auth.user
        ? 'Accéder au registre'
        : 'Créer un compte';

    return (
        <>
            <Head title="Registre bovin" />

            <div className="bg-base-100 text-base-content">
                <header className="absolute inset-x-0 top-0 z-20">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-6 sm:px-8">
                        <Link href="/" className="flex items-center gap-2.5">
                            <ApplicationLogo className="h-9 w-auto text-primary" />
                            <span className="font-display text-xl tracking-tight">
                                Bokinomby
                            </span>
                            <span className="ms-2 hidden text-[11px] tracking-[0.14em] text-base-content/45 md:block">
                                REGISTRE BOVIN
                            </span>
                        </Link>

                        <div className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={route('bovins.index')}
                                    className="btn btn-primary btn-sm h-10 rounded-full px-5 text-sm font-semibold normal-case"
                                >
                                    Mon registre
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="hidden rounded-full px-4 py-2 text-sm font-medium text-base-content/70 transition hover:text-base-content sm:block"
                                    >
                                        Se connecter
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="btn btn-primary btn-sm h-10 rounded-full px-5 text-sm font-semibold normal-case"
                                    >
                                        Créer un compte
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <section className="relative overflow-hidden">
                    <div className="mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-6 lg:pb-28 lg:pt-40">
                        <motion.div
                            variants={heroVariants}
                            initial={reduceMotion ? false : 'hidden'}
                            animate="visible"
                        >
                            <motion.p
                                variants={itemVariants}
                                className="text-sm text-base-content/55"
                            >
                                Recensement bovin, quartier par quartier.
                            </motion.p>

                            <motion.h1
                                variants={itemVariants}
                                className="mt-6 max-w-[13ch] font-display text-[clamp(2.8rem,6vw,5.1rem)] leading-[0.98] tracking-[-0.02em]"
                            >
                                Chaque bête a sa boucle. Chaque boucle a son
                                dossier.
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="mt-7 max-w-[52ch] text-base leading-relaxed text-base-content/65"
                            >
                                Bokinomby réunit l'identité, la localisation et
                                le suivi sanitaire du cheptel dans un registre
                                unique, tenu par les éleveurs et les agents de
                                terrain.
                            </motion.p>

                            <motion.div
                                variants={itemVariants}
                                className="mt-9 flex flex-wrap items-center gap-3"
                            >
                                <Link
                                    href={primaryHref}
                                    className="btn btn-primary h-12 rounded-full px-6 text-sm font-semibold normal-case"
                                >
                                    {primaryLabel}
                                </Link>
                                <Link
                                    href={
                                        auth.user
                                            ? route('profile.edit')
                                            : route('login')
                                    }
                                    className="btn btn-outline h-12 rounded-full border-base-content/20 px-6 text-sm font-semibold normal-case hover:border-base-content/40 hover:bg-base-200"
                                >
                                    {auth.user
                                        ? 'Mon profil'
                                        : 'Se connecter'}
                                </Link>
                            </motion.div>

                            <motion.ul
                                variants={itemVariants}
                                className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-base-content/15 pt-5 text-xs text-base-content/55"
                            >
                                <li>Boucle unique</li>
                                <li>Dossier sanitaire</li>
                                <li>Localisation administrative</li>
                            </motion.ul>
                        </motion.div>

                        <div className="relative mx-auto w-full max-w-[22rem] lg:max-w-[24rem]">
                            <motion.div
                                initial={
                                    reduceMotion
                                        ? false
                                        : { opacity: 0, y: -46, rotate: -7 }
                                }
                                animate={{ opacity: 1, y: 0, rotate: 3 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 60,
                                    damping: 14,
                                    delay: 0.15,
                                }}
                            >
                                <EarTag
                                    number="BK-0248"
                                    label="BOKINOMBY · EXEMPLE DE FICHE"
                                    title="Femelle · race locale"
                                    rows={[
                                        ['Naissance', '12 mars 2024'],
                                        ['Quartier', 'Matete'],
                                        ['District', 'Kinshasa'],
                                    ]}
                                    footer="FICHE D'ÉLEVAGE · DÉMONSTRATION"
                                />
                            </motion.div>

                            <p className="mt-6 text-center text-xs text-base-content/45">
                                Une fiche, une bête. La boucle fait foi.
                            </p>
                        </div>
                    </div>
                </section>

                <footer>
                    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-base-content/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <div className="flex items-center gap-2.5">
                            <ApplicationLogo className="h-7 w-auto text-primary" />
                            <span className="font-display text-base text-base-content">
                                Bokinomby
                            </span>
                        </div>
                        <p>Registre bovin · Kinshasa · {new Date().getFullYear()}</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
