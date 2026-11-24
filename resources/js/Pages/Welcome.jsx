import ApplicationLogo from '@/Components/ApplicationLogo';
import EarTag from '@/Components/EarTag';
import { Head, Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';

const STEPS = [
    {
        title: 'Boucler',
        copy: "Un numéro de boucle unique identifie l'animal, son sexe et ses signes particuliers. Aucune fiche ne se confond avec une autre.",
    },
    {
        title: 'Situer',
        copy: "Chaque bête est rattachée à son quartier, sa commune et son district. Le recensement se lit à toutes les échelles.",
    },
    {
        title: 'Suivre',
        copy: 'Naissance, décès, dossier de santé : les événements de la vie de la bête restent attachés à sa fiche.',
    },
];

const REGISTRY = [
    {
        term: 'Identité',
        copy: 'Boucle unique, sexe, signes particuliers.',
    },
    {
        term: 'Origine',
        copy: 'Date de naissance et date de décès.',
    },
    {
        term: 'Localisation',
        copy: 'District, commune, quartier.',
    },
    {
        term: 'Santé',
        copy: 'Dossier de suivi sanitaire de la bête.',
    },
];

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

                        <nav className="hidden items-center gap-8 text-sm text-base-content/60 md:flex">
                            <a
                                href="#methode"
                                className="transition-colors hover:text-base-content"
                            >
                                La méthode
                            </a>
                            <a
                                href="#registre"
                                className="transition-colors hover:text-base-content"
                            >
                                Le registre
                            </a>
                        </nav>

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

                <section
                    id="methode"
                    className="border-t border-base-content/15"
                >
                    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
                        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                            <h2 className="max-w-[14ch] font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                                Du champ au dossier.
                            </h2>
                            <p className="max-w-[58ch] self-end text-base leading-relaxed text-base-content/65">
                                Pas de registre lourd ni de formulaire sans
                                suite. Trois gestes suffisent pour qu'une bête
                                entre dans le recensement et y reste
                                retrouvable.
                            </p>
                        </div>

                        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
                            {STEPS.map((step, index) => (
                                <li
                                    key={step.title}
                                    className="border-t border-base-content/15 pt-6"
                                >
                                    <span className="font-display text-2xl text-secondary">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="mt-4 text-lg font-semibold">
                                        {step.title}
                                    </h3>
                                    <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-base-content/60">
                                        {step.copy}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section
                    id="registre"
                    className="bg-primary text-primary-content"
                >
                    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:py-28">
                        <div>
                            <h2 className="max-w-[15ch] font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                                Quatre informations, une seule fiche.
                            </h2>
                            <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-primary-content/70">
                                Le registre suit la même chaîne que
                                l'administration du territoire, du district
                                jusqu'au quartier, pour que chaque animal soit
                                localisable sans ambiguïté.
                            </p>
                            <Link
                                href={primaryHref}
                                className="btn mt-9 h-11 rounded-full border-0 bg-base-100 px-6 text-sm font-semibold normal-case text-primary hover:bg-base-200"
                            >
                                {primaryLabel}
                            </Link>
                        </div>

                        <dl>
                            {REGISTRY.map((row) => (
                                <div
                                    key={row.term}
                                    className="grid gap-1 border-t border-primary-content/15 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6"
                                >
                                    <dt className="text-sm font-semibold">
                                        {row.term}
                                    </dt>
                                    <dd className="text-sm text-primary-content/65">
                                        {row.copy}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                <section className="border-b border-base-content/15">
                    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
                        <h2 className="max-w-[18ch] font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                            Le registre commence par une boucle.
                        </h2>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                href={primaryHref}
                                className="btn btn-primary h-12 rounded-full px-6 text-sm font-semibold normal-case"
                            >
                                {primaryLabel}
                            </Link>
                            <span className="text-sm text-base-content/55">
                                {auth.user
                                    ? 'Votre espace est prêt.'
                                    : 'Aucune installation. Un compte suffit.'}
                            </span>
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
