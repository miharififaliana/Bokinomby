import EarTag from '@/Components/EarTag';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
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
    provinces = [],
    utilisateurs = [],
    selectedProprietaireId,
}) {
    const reduceMotion = useReducedMotion();
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        proprietaire_id: selectedProprietaireId
            ? String(selectedProprietaireId)
            : '',
        sexe: '',
        date_naissance: '',
        date_deces: '',
        commune_id: '',
        signe_particulier: '',
        dossier_sante: '',
    });

    const [provinceId, setProvinceId] = useState('');
    const [regionId, setRegionId] = useState('');
    const [districtId, setDistrictId] = useState('');

    const province = useMemo(
        () => provinces.find((item) => String(item.id) === provinceId),
        [provinces, provinceId],
    );

    const regions = province?.regions ?? [];

    const region = useMemo(
        () => regions.find((item) => String(item.id) === regionId),
        [regions, regionId],
    );

    const districts = region?.districts ?? [];

    const district = useMemo(
        () => districts.find((item) => String(item.id) === districtId),
        [districts, districtId],
    );

    const communes = district?.communes ?? [];
    const commune = communes.find(
        (item) => String(item.id) === data.commune_id,
    );

    const numeroPreview = district
        ? `${district.code_postal ?? '000'}-…`
        : 'AUTO';

    const sexeLabel =
        data.sexe === 'male'
            ? t('bovins.index.male')
            : data.sexe === 'femelle'
              ? t('bovins.index.female')
              : '—';

    const proprietaire = utilisateurs.find(
        (item) => String(item.id) === data.proprietaire_id,
    );

    const submit = (event) => {
        event.preventDefault();

        post(route('bovins.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title={t('bovins.create.title')} />

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
                        {t('bovins.create.back')}
                    </Link>

                    <p className="mt-8 text-sm text-base-content/45">
                        {t('bovins.create.eyebrow')}
                    </p>
                    <h1 className="mt-3 max-w-[16ch] font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
                        {t('bovins.create.heading')}
                    </h1>
                    <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-base-content/60">
                        {t('bovins.create.description')}
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
                                    {t('bovins.create.ownerSection')}
                                </span>
                            </legend>

                            {utilisateurs.length === 0 ? (
                                <div
                                    role="alert"
                                    className="mt-7 rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4 text-sm leading-relaxed text-base-content/70"
                                >
                                    <p>{t('bovins.create.noUsers')}</p>
                                    <Link
                                        href={route('eleveurs.create')}
                                        className="btn btn-primary mt-4 h-10 rounded-full px-5 text-xs font-semibold normal-case"
                                    >
                                        {t('bovins.create.createUser')}
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-7">
                                    <div className="flex items-center justify-between gap-4">
                                        <InputLabel
                                            htmlFor="proprietaire_id"
                                            value={t(
                                                'bovins.create.ownerLabel',
                                            )}
                                        />
                                        <Link
                                            href={route('eleveurs.create')}
                                            className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                                        >
                                            {t('bovins.create.createUser')}
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
                                            {t('bovins.create.chooseUser')}
                                        </option>
                                        {utilisateurs.map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                                {item.cin
                                                    ? ` — CIN ${item.cin}`
                                                    : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-1.5 text-xs text-base-content/45">
                                        {t('bovins.create.ownerHelp')}
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
                                    {t('bovins.create.identification')}
                                </span>
                            </legend>

                            <div className="mt-7 grid gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <span className="block text-[13px] font-semibold text-base-content/70">
                                        {t('bovins.create.sex')}
                                    </span>

                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {[
                                            [
                                                'femelle',
                                                t('bovins.index.female'),
                                            ],
                                            ['male', t('bovins.index.male')],
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
                                        value={t('bovins.create.birthDate')}
                                    />
                                    <TextInput
                                        id="date_naissance"
                                        type="date"
                                        value={data.date_naissance}
                                        max={todayInputValue()}
                                        className="mt-2"
                                        isFocused
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
                                        value={t('bovins.create.deathDate')}
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
                                    {t('bovins.create.location')}
                                </span>
                            </legend>

                            {provinces.length === 0 ? (
                                <div
                                    role="alert"
                                    className="mt-7 rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4 text-sm leading-relaxed text-base-content/70"
                                >
                                    {t('bovins.create.noLocation')}{' '}
                                    <code>php artisan db:seed</code>{' '}
                                    {t('bovins.create.noLocationAfter')}
                                </div>
                            ) : (
                                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <InputLabel
                                            htmlFor="province"
                                            value={t('bovins.create.province')}
                                        />
                                        <select
                                            id="province"
                                            value={provinceId}
                                            className={`${selectClass} mt-2`}
                                            onChange={(event) => {
                                                setProvinceId(
                                                    event.target.value,
                                                );
                                                setRegionId('');
                                                setDistrictId('');
                                                setData('commune_id', '');
                                            }}
                                            required
                                        >
                                            <option value="" disabled>
                                                {t(
                                                    'bovins.create.chooseProvince',
                                                )}
                                            </option>
                                            {provinces.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="region"
                                            value={t('bovins.create.region')}
                                        />
                                        <select
                                            id="region"
                                            value={regionId}
                                            className={`${selectClass} mt-2`}
                                            disabled={!province}
                                            onChange={(event) => {
                                                setRegionId(
                                                    event.target.value,
                                                );
                                                setDistrictId('');
                                                setData('commune_id', '');
                                            }}
                                            required
                                        >
                                            <option value="" disabled>
                                                {province
                                                    ? t(
                                                          'bovins.create.chooseRegion',
                                                      )
                                                    : t(
                                                          'bovins.create.firstProvince',
                                                      )}
                                            </option>
                                            {regions.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="district"
                                            value={t('bovins.create.district')}
                                        />
                                        <select
                                            id="district"
                                            value={districtId}
                                            className={`${selectClass} mt-2`}
                                            disabled={!region}
                                            onChange={(event) => {
                                                setDistrictId(
                                                    event.target.value,
                                                );
                                                setData('commune_id', '');
                                            }}
                                            required
                                        >
                                            <option value="" disabled>
                                                {region
                                                    ? t(
                                                          'bovins.create.chooseDistrict',
                                                      )
                                                    : t(
                                                          'bovins.create.firstRegion',
                                                      )}
                                            </option>
                                            {districts.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                    {item.code_postal
                                                        ? ` — ${item.code_postal}`
                                                        : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="commune_id"
                                            value={t('bovins.create.commune')}
                                        />
                                        <select
                                            id="commune_id"
                                            name="commune_id"
                                            value={data.commune_id}
                                            className={`${selectClass} mt-2`}
                                            disabled={!district}
                                            onChange={(event) =>
                                                setData(
                                                    'commune_id',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                        >
                                            <option value="" disabled>
                                                {district
                                                    ? t(
                                                          'bovins.create.chooseCommune',
                                                      )
                                                    : t(
                                                          'bovins.create.firstDistrict',
                                                      )}
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
                                        <InputError
                                            message={errors.commune_id}
                                        />
                                    </div>

                                    <p className="text-xs leading-relaxed text-base-content/45 sm:col-span-2">
                                        {t('bovins.create.earTagNote')}
                                    </p>
                                </div>
                            )}
                        </fieldset>

                        <fieldset>
                            <legend className="flex items-baseline gap-3 border-b border-base-content/15 pb-3">
                                <span className="font-display text-lg text-secondary">
                                    04
                                </span>
                                <span className="text-sm font-semibold">
                                    {t('bovins.create.signsHealth')}
                                </span>
                            </legend>

                            <div className="mt-7 grid gap-6">
                                <div>
                                    <InputLabel
                                        htmlFor="signe_particulier"
                                        value={t('bovins.create.signs')}
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
                                        {t('bovins.create.signsHelp')}
                                    </p>
                                    <InputError
                                        message={errors.signe_particulier}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="dossier_sante"
                                        value={t('bovins.create.health')}
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
                                        {t('bovins.create.healthHelp')}
                                    </p>
                                    <InputError message={errors.dossier_sante} />
                                </div>
                            </div>
                        </fieldset>

                        <div className="flex flex-wrap items-center gap-3 border-t border-base-content/15 pt-7">
                            <PrimaryButton
                                disabled={processing || utilisateurs.length === 0}
                            >
                                {processing
                                    ? t('bovins.create.saving')
                                    : t('bovins.create.submit')}
                            </PrimaryButton>
                            <Link
                                href={route('bovins.index')}
                                className="btn btn-ghost h-11 rounded-full px-5 text-sm font-semibold normal-case text-base-content/55 hover:bg-base-200 hover:text-base-content"
                            >
                                {t('bovins.create.cancel')}
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
                                number={numeroPreview}
                                label={t('bovins.create.tagLabel')}
                                title={
                                    proprietaire
                                        ? proprietaire.name
                                        : t('bovins.create.tagOwner')
                                }
                                rows={[
                                    [t('bovins.create.tagSex'), sexeLabel],
                                    [
                                        t('bovins.create.tagBirth'),
                                        formatDate(data.date_naissance),
                                    ],
                                    [
                                        t('bovins.create.tagCommune'),
                                        commune?.name ?? '—',
                                    ],
                                    [
                                        t('bovins.create.tagDistrict'),
                                        district?.name ?? '—',
                                    ],
                                ]}
                                footer={t('bovins.create.tagFooter')}
                            />
                        </motion.div>

                        <div className="mx-auto mt-6 max-w-[20rem] border-t border-base-content/15 pt-5 text-xs leading-relaxed text-base-content/45">
                            <p>{t('bovins.create.aside1')}</p>
                            <p className="mt-3">
                                {t('bovins.create.aside2')}
                            </p>
                            <p className="mt-3">
                                {t('bovins.create.aside3')}
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
