import EarTag from '@/Components/EarTag';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';

function formatDate(value) {
    if (!value) {
        return '—';
    }

    const [year, month, day] = value.split('-');

    return `${day}/${month}/${year}`;
}

function todayInputValue() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${today.getFullYear()}-${month}-${day}`;
}

const selectClass =
    'select select-bordered h-11 w-full rounded-xl border-base-content/20 bg-base-100 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

const textareaClass =
    'textarea textarea-bordered min-h-24 w-full rounded-xl border-base-content/20 bg-base-100 text-sm leading-relaxed focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

export default function Create({
    districts,
    personnes,
    selectedProprietaireId,
}) {
    const reduceMotion = useReducedMotion();
    const { data, setData, post, processing, errors } = useForm({
        proprietaire_id: selectedProprietaireId
            ? String(selectedProprietaireId)
            : '',
        numero_boucle: '',
        sexe: '',
        date_naissance: '',
        date_deces: '',
        quartier_id: '',
        signe_particulier: '',
        dossier_sante: '',
    });

    const [districtId, setDistrictId] = useState('');
    const [communeId, setCommuneId] = useState('');

    const district = useMemo(
        () => districts.find((item) => String(item.id) === districtId),
        [districts, districtId],
    );

    const communes = district?.communes ?? [];

    const commune = useMemo(
        () => communes.find((item) => String(item.id) === communeId),
        [communes, communeId],
    );

    const quartiers = commune?.quartiers ?? [];
    const quartier = quartiers.find(
        (item) => String(item.id) === data.quartier_id,
    );

    const sexeLabel =
        data.sexe === 'male' ? 'Mâle' : data.sexe === 'femelle' ? 'Femelle' : '—';

    const proprietaire = personnes.find(
        (item) => String(item.id) === data.proprietaire_id,
    );

    const submit = (event) => {
        event.preventDefault();

        post(route('bovins.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Enregistrer un bovin" />

            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Link
                        href={route('bovins.index')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-base-content/50 underline-offset-4 transition-colors hover:text-base-content hover:underline"
                    >
                        <span aria-hidden="true">←</span>
                        Retour au registre
                    </Link>

                    <p className="mt-8 text-sm text-base-content/45">
                        Nouvelle fiche
                    </p>
                    <h1 className="mt-3 max-w-[16ch] font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
                        Ouvrir la boucle d'une bête.
                    </h1>
                    <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-base-content/60">
                        Chaque bête appartient à une personne. La boucle
                        identifie l'animal de façon unique ; le reste du dossier
                        le situe dans le territoire et garde la trace de son
                        état sanitaire.
                    </p>
                </motion.div>

                <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                    <motion.form
                        onSubmit={submit}
                        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.08,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="space-y-12"
                    >
                        <fieldset>
                            <legend className="flex items-baseline gap-3 border-b border-base-content/15 pb-3">
                                <span className="font-display text-lg text-secondary">
                                    01
                                </span>
                                <span className="text-sm font-semibold">
                                    Propriétaire
                                </span>
                            </legend>

                            {personnes.length === 0 ? (
                                <div
                                    role="alert"
                                    className="mt-7 rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4 text-sm leading-relaxed text-base-content/70"
                                >
                                    <p>
                                        Aucune personne n'est encore inscrite.
                                        Créez d'abord sa fiche, puis revenez
                                        assigner ses bovins.
                                    </p>
                                    <Link
                                        href={route('personnes.create')}
                                        className="btn btn-primary mt-4 h-10 rounded-full px-5 text-xs font-semibold normal-case"
                                    >
                                        Créer une personne
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-7">
                                    <div className="flex items-center justify-between gap-4">
                                        <InputLabel
                                            htmlFor="proprietaire_id"
                                            value="Personne propriétaire"
                                        />
                                        <Link
                                            href={route('personnes.create')}
                                            className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                                        >
                                            Créer une personne
                                        </Link>
                                    </div>

                                    <select
                                        id="proprietaire_id"
                                        name="proprietaire_id"
                                        value={data.proprietaire_id}
                                        className={`${selectClass} mt-2`}
                                        onChange={(event) =>
                                            setData(
                                                'proprietaire_id',
                                                event.target.value,
                                            )
                                        }
                                        required
                                    >
                                        <option value="" disabled>
                                            Choisir une personne
                                        </option>
                                        {personnes.map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.nom}
                                                {item.telephone
                                                    ? ` — ${item.telephone}`
                                                    : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-1.5 text-xs text-base-content/45">
                                        Une personne peut posséder plusieurs
                                        bovins.
                                    </p>
                                    <InputError
                                        message={errors.proprietaire_id}
                                    />
                                </div>
                            )}
                        </fieldset>

                        <fieldset>
                            <legend className="flex items-baseline gap-3 border-b border-base-content/15 pb-3">
                                <span className="font-display text-lg text-secondary">
                                    02
                                </span>
                                <span className="text-sm font-semibold">
                                    Identification
                                </span>
                            </legend>

                            <div className="mt-7 grid gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <InputLabel
                                        htmlFor="numero_boucle"
                                        value="Numéro de boucle"
                                    />
                                    <TextInput
                                        id="numero_boucle"
                                        value={data.numero_boucle}
                                        className="mt-2 font-medium uppercase tracking-wide"
                                        placeholder="BK-0248"
                                        maxLength={50}
                                        isFocused
                                        onChange={(event) =>
                                            setData(
                                                'numero_boucle',
                                                event.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <p className="mt-1.5 text-xs text-base-content/45">
                                        Un numéro unique, tel qu'inscrit sur la
                                        boucle de l'animal.
                                    </p>
                                    <InputError
                                        message={errors.numero_boucle}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <span className="block text-[13px] font-semibold text-base-content/70">
                                        Sexe
                                    </span>

                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {[
                                            ['femelle', 'Femelle'],
                                            ['male', 'Mâle'],
                                        ].map(([value, label]) => (
                                            <label
                                                key={value}
                                                className={`flex h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${
                                                    data.sexe === value
                                                        ? 'border-primary bg-primary text-primary-content'
                                                        : 'border-base-content/20 bg-base-100 text-base-content/60 hover:border-base-content/40'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="sexe"
                                                    value={value}
                                                    checked={
                                                        data.sexe === value
                                                    }
                                                    onChange={(event) =>
                                                        setData(
                                                            'sexe',
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="sr-only"
                                                />
                                                {label}
                                            </label>
                                        ))}
                                    </div>

                                    <InputError message={errors.sexe} />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="date_naissance"
                                        value="Date de naissance"
                                    />
                                    <TextInput
                                        id="date_naissance"
                                        type="date"
                                        value={data.date_naissance}
                                        max={todayInputValue()}
                                        className="mt-2"
                                        onChange={(event) =>
                                            setData(
                                                'date_naissance',
                                                event.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.date_naissance}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="date_deces"
                                        value="Date de décès (facultatif)"
                                    />
                                    <TextInput
                                        id="date_deces"
                                        type="date"
                                        value={data.date_deces}
                                        min={data.date_naissance || undefined}
                                        className="mt-2"
                                        onChange={(event) =>
                                            setData(
                                                'date_deces',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <InputError message={errors.date_deces} />
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend className="flex items-baseline gap-3 border-b border-base-content/15 pb-3">
                                <span className="font-display text-lg text-secondary">
                                    03
                                </span>
                                <span className="text-sm font-semibold">
                                    Localisation
                                </span>
                            </legend>

                            {districts.length === 0 ? (
                                <div
                                    role="alert"
                                    className="mt-7 rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4 text-sm leading-relaxed text-base-content/70"
                                >
                                    Aucun quartier n'est disponible. Lancez{' '}
                                    <code>php artisan db:seed</code> pour
                                    charger le découpage de démonstration.
                                </div>
                            ) : (
                                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <InputLabel
                                            htmlFor="district"
                                            value="District"
                                        />
                                        <select
                                            id="district"
                                            value={districtId}
                                            className={`${selectClass} mt-2`}
                                            onChange={(event) => {
                                                setDistrictId(
                                                    event.target.value,
                                                );
                                                setCommuneId('');
                                                setData('quartier_id', '');
                                            }}
                                            required
                                        >
                                            <option value="" disabled>
                                                Choisir un district
                                            </option>
                                            {districts.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="commune"
                                            value="Commune"
                                        />
                                        <select
                                            id="commune"
                                            value={communeId}
                                            className={`${selectClass} mt-2`}
                                            disabled={!district}
                                            onChange={(event) => {
                                                setCommuneId(
                                                    event.target.value,
                                                );
                                                setData('quartier_id', '');
                                            }}
                                            required
                                        >
                                            <option value="" disabled>
                                                {district
                                                    ? 'Choisir une commune'
                                                    : "D'abord le district"}
                                            </option>
                                            {communes.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel
                                            htmlFor="quartier_id"
                                            value="Quartier"
                                        />
                                        <select
                                            id="quartier_id"
                                            name="quartier_id"
                                            value={data.quartier_id}
                                            className={`${selectClass} mt-2`}
                                            disabled={!commune}
                                            onChange={(event) =>
                                                setData(
                                                    'quartier_id',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                        >
                                            <option value="" disabled>
                                                {commune
                                                    ? 'Choisir un quartier'
                                                    : "D'abord la commune"}
                                            </option>
                                            {quartiers.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.quartier_id}
                                        />
                                    </div>
                                </div>
                            )}
                        </fieldset>

                        <fieldset>
                            <legend className="flex items-baseline gap-3 border-b border-base-content/15 pb-3">
                                <span className="font-display text-lg text-secondary">
                                    04
                                </span>
                                <span className="text-sm font-semibold">
                                    Signes et santé
                                </span>
                            </legend>

                            <div className="mt-7 grid gap-6">
                                <div>
                                    <InputLabel
                                        htmlFor="signe_particulier"
                                        value="Signes particuliers (facultatif)"
                                    />
                                    <textarea
                                        id="signe_particulier"
                                        value={data.signe_particulier}
                                        className={`${textareaClass} mt-2`}
                                        placeholder={
                                            'Robe pie rouge\nCornes absentes\nMarque à l’oreille droite'
                                        }
                                        onChange={(event) =>
                                            setData(
                                                'signe_particulier',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <p className="mt-1.5 text-xs text-base-content/45">
                                        Un signe par ligne, pour retrouver la
                                        bête sans ambiguïté.
                                    </p>
                                    <InputError
                                        message={errors.signe_particulier}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="dossier_sante"
                                        value="Dossier de santé (facultatif)"
                                    />
                                    <textarea
                                        id="dossier_sante"
                                        value={data.dossier_sante}
                                        className={`${textareaClass} mt-2`}
                                        placeholder={
                                            'Vaccination fièvre aphteuse — 12/03/2026\nDéparasitage — 20/04/2026'
                                        }
                                        onChange={(event) =>
                                            setData(
                                                'dossier_sante',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <p className="mt-1.5 text-xs text-base-content/45">
                                        Une note de suivi par ligne.
                                    </p>
                                    <InputError message={errors.dossier_sante} />
                                </div>
                            </div>
                        </fieldset>

                        <div className="flex flex-wrap items-center gap-3 border-t border-base-content/15 pt-7">
                            <PrimaryButton
                                disabled={processing || personnes.length === 0}
                            >
                                {processing
                                    ? 'Enregistrement…'
                                    : 'Enregistrer le bovin'}
                            </PrimaryButton>
                            <Link
                                href={route('bovins.index')}
                                className="btn btn-ghost h-11 rounded-full px-5 text-sm font-semibold normal-case text-base-content/55 hover:bg-base-200 hover:text-base-content"
                            >
                                Annuler
                            </Link>
                        </div>
                    </motion.form>

                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <motion.div
                            initial={
                                reduceMotion
                                    ? false
                                    : { opacity: 0, y: -24, rotate: -3 }
                            }
                            animate={{ opacity: 1, y: 0, rotate: 1.5 }}
                            transition={{
                                type: 'spring',
                                stiffness: 70,
                                damping: 15,
                                delay: 0.15,
                            }}
                            className="mx-auto w-full max-w-[19rem]"
                        >
                            <EarTag
                                number={data.numero_boucle || 'BK—'}
                                label="BOKINOMBY · NOUVELLE FICHE"
                                title={
                                    proprietaire
                                        ? proprietaire.nom
                                        : 'Propriétaire à préciser'
                                }
                                rows={[
                                    ['Sexe', sexeLabel],
                                    ['Naissance', formatDate(data.date_naissance)],
                                    ['Quartier', quartier?.name ?? '—'],
                                    ['District', district?.name ?? '—'],
                                ]}
                                footer="APERÇU · NON ENREGISTRÉ"
                            />
                        </motion.div>

                        <div className="mx-auto mt-6 max-w-[20rem] border-t border-base-content/15 pt-5 text-xs leading-relaxed text-base-content/45">
                            <p>
                                La boucle fait foi. Vérifiez-la sur l'animal
                                avant de valider la fiche.
                            </p>
                            <p className="mt-3">
                                Une personne peut recevoir plusieurs bovins :
                                revenez sur sa fiche pour compléter son cheptel.
                            </p>
                            <p className="mt-3">
                                Les signes particuliers et le dossier de santé
                                pourront être complétés au fil des visites.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
