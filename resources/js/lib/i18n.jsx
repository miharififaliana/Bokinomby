import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

const THEME_STORAGE_KEY = 'bokinomby.theme';
const LOCALE_STORAGE_KEY = 'bokinomby.locale';

/** Correspondance entre la préférence et le thème daisyUI. */
export const THEMES = {
    light: 'bokinomby',
    dark: 'bokinomby-dark',
};

export const LOCALES = ['fr', 'mg'];

export const translations = {
    fr: {
        nav: {
            brandTagline: 'REGISTRE BOVIN',
            dashboard: 'Tableau de bord',
            registry: 'Registre',
            registryBovin: 'Registre bovin',
            breeders: 'Éleveurs',
            users: 'Utilisateurs',
            profile: 'Profil',
            myProfile: 'Mon profil',
            logout: 'Se déconnecter',
            openMenu: 'Ouvrir le menu',
            closeMenu: 'Fermer le menu',
        },
        profile: {
            title: 'Votre dossier',
            subtitle:
                "Les informations qui accompagnent votre accès au registre bovin.",
            preferences: {
                title: 'Préférences',
                description:
                    "Choisissez l'apparence de l'interface et la langue d'affichage.",
                theme: 'Thème',
                themeDescription:
                    "Adaptez l'affichage à votre confort de lecture.",
                light: 'Clair',
                dark: 'Sombre',
                language: 'Langue',
                languageDescription:
                    "Choisissez la langue de l'interface.",
                french: 'Français',
                malagasy: 'Malgache',
            },
            information: {
                title: 'Informations du profil',
                description:
                    "Votre nom et l'adresse e-mail associés à votre accès.",
                name: 'Nom complet',
                email: 'Adresse e-mail',
                save: 'Enregistrer',
                saving: 'Enregistrement…',
                saved: 'Enregistré.',
                unverified:
                    "Votre adresse e-mail n'est pas encore vérifiée.",
                resend: 'Renvoyer le lien de vérification.',
                resent: 'Un nouveau lien de vérification a été envoyé.',
            },
            password: {
                title: 'Mot de passe',
                description:
                    'Utilisez un mot de passe long et unique pour protéger votre accès au registre.',
                current: 'Mot de passe actuel',
                new: 'Nouveau mot de passe',
                confirm: 'Confirmer le nouveau mot de passe',
                submit: 'Mettre à jour',
                submitting: 'Mise à jour…',
                saved: 'Enregistré.',
            },
            delete: {
                title: 'Supprimer le compte',
                description:
                    'La suppression est définitive. Les données rattachées à votre compte seront perdues. Téléchargez ce que vous souhaitez conserver avant de continuer.',
                submit: 'Supprimer mon compte',
                confirmTitle: 'Confirmer la suppression',
                confirmDescription:
                    'Cette action est irréversible. Saisissez votre mot de passe pour supprimer définitivement votre compte.',
                password: 'Mot de passe',
                passwordPlaceholder: 'Votre mot de passe',
                cancel: 'Annuler',
                confirm: 'Supprimer définitivement',
                deleting: 'Suppression…',
            },
        },
        bovins: {
            index: {
                title: 'Registre bovin',
                eyebrow: 'Registre bovin',
                heading: 'Le cheptel enregistré.',
                description:
                    'Chaque boucle ouvre un dossier unique : identité, origine, localisation et suivi sanitaire de la bête.',
                breeders: 'Les éleveurs',
                create: 'Enregistrer un bovin',
                searchLabel: 'Rechercher un bovin par boucle d’oreille',
                searchPlaceholder: '101-1',
                search: 'Rechercher',
                searching: 'Recherche…',
                reset: 'Réinitialiser',
                resetSearch: 'Réinitialiser la recherche',
                statsTotal: 'Bovins',
                statsFemelles: 'Femelles',
                statsMales: 'Mâles',
                female: 'Femelle',
                male: 'Mâle',
                count: ':from–:to sur :total :label',
                bovinSingular: 'bovin',
                bovinPlural: 'bovins',
                assigned: 'Assignés à leurs propriétaires',
                boucle: 'Boucle d’oreille',
                born: 'naissance',
                viewRecord: 'Voir la fiche détaillée →',
                alive: 'Vivant',
                dead: 'Mort',
                previous: 'Précédent',
                next: 'Suivant',
                page: 'Page :current sur :last',
                emptySearchTitle: 'Aucun bovin pour cette boucle.',
                emptyTitle: 'Aucun bovin au registre.',
                emptySearchText:
                    'Vérifiez le numéro saisi ou réinitialisez la recherche.',
                emptyText:
                    "Inscrivez d'abord un utilisateur, puis assignez-lui une ou plusieurs bêtes. Le registre commence par un propriétaire.",
                addUser: 'Ajouter un utilisateur',
            },
            create: {
                title: 'Enregistrer un bovin',
                back: 'Retour au registre',
                eyebrow: 'Nouvelle fiche',
                heading: 'Ouvrir la boucle d’une bête.',
                description:
                    "Chaque bête appartient à un utilisateur. La boucle est générée automatiquement à partir du code postal du district et du numéro de l'animal ; choisissez sa localisation et complétez son dossier sanitaire.",
                ownerSection: 'Propriétaire',
                noUsers:
                    "Aucun utilisateur n'est encore inscrit. Créez d'abord son compte, puis revenez assigner ses bovins.",
                createUser: 'Créer un utilisateur',
                ownerLabel: 'Utilisateur propriétaire',
                chooseUser: 'Choisir un utilisateur',
                ownerHelp: 'Un utilisateur peut posséder plusieurs bovins.',
                identification: 'Identification',
                sex: 'Sexe',
                birthDate: 'Date de naissance',
                deathDate: 'Date de décès (facultatif)',
                location: 'Localisation',
                noLocation:
                    "Aucune localisation n'est disponible. Lancez",
                noLocationAfter:
                    'pour charger le découpage administratif.',
                province: 'Province',
                region: 'Région',
                district: 'District',
                commune: 'Commune',
                chooseProvince: 'Choisir une province',
                chooseRegion: 'Choisir une région',
                chooseDistrict: 'Choisir un district',
                chooseCommune: 'Choisir une commune',
                firstProvince: "D'abord la province",
                firstRegion: "D'abord la région",
                firstDistrict: "D'abord le district",
                earTagNote:
                    "La boucle d'oreille sera générée à l'enregistrement : code postal du district + numéro individuel du bovin (ex. 101-1).",
                signsHealth: 'Signes et santé',
                signs: 'Signes particuliers (facultatif)',
                signsHelp:
                    'Un signe par ligne, pour retrouver la bête sans ambiguïté.',
                health: 'Dossier de santé (facultatif)',
                healthHelp: 'Une note de suivi par ligne.',
                saving: 'Enregistrement…',
                submit: 'Enregistrer le bovin',
                cancel: 'Annuler',
                tagLabel: 'BOKINOMBY · NOUVELLE FICHE',
                tagOwner: 'Propriétaire à préciser',
                tagSex: 'Sexe',
                tagBirth: 'Naissance',
                tagCommune: 'Commune',
                tagDistrict: 'District',
                tagFooter: "BOUCLE GÉNÉRÉE À L'ENREGISTREMENT",
                aside1:
                    "La boucle est attribuée automatiquement par l'application, à partir du code postal du district choisi.",
                aside2:
                    'Un utilisateur peut recevoir plusieurs bovins : revenez sur sa fiche pour compléter son cheptel.',
                aside3:
                    'Les signes particuliers et le dossier de santé pourront être complétés au fil des visites.',
            },
            edit: {
                title: 'Modifier :boucle',
                back: 'Retour à la fiche',
                eyebrow: 'Modification de la fiche',
                heading: 'Modifier :boucle.',
                sex: 'Sexe',
                dates: 'Dates',
                birthDate: 'Date de naissance',
                deathDate: 'Date de décès (facultatif)',
                signsHealth: 'Signes et santé',
                signs: 'Signes particuliers (facultatif)',
                health: 'Dossier de santé (facultatif)',
                saving: 'Enregistrement…',
                submit: 'Enregistrer les modifications',
                cancel: 'Annuler',
            },
            show: {
                title: 'Fiche bovine',
                back: 'Retour au registre',
                eyebrow: 'Fiche bovine',
                boucleSex: 'Boucle d’oreille · :sex',
                alive: 'Vivant',
                dead: 'Mort',
                edit: 'Modifier',
                delete: 'Supprimer',
                deleteTitle: 'Supprimer ce bovin ?',
                deleteText:
                    "Cette action est définitive. L'historique de la fiche sera conservé.",
                confirmDelete: 'Confirmer la suppression',
                deleting: 'Suppression…',
                cancel: 'Annuler',
                identity: 'Identité',
                owner: 'Propriétaire',
                earTag: 'Numéro de boucle d’oreille',
                sex: 'Sexe',
                birthDate: 'Date de naissance',
                deathDate: 'Date de décès',
                noDeath: "Aucune — l'animal est vivant.",
                signs: 'Signes particuliers',
                noSigns: 'Aucun signe particulier relevé.',
                health: 'État de santé',
                noHealth: 'Aucun suivi sanitaire enregistré pour cette bête.',
                history: 'Historique des modifications',
                noHistory: 'Aucun historique enregistré pour cette bête.',
                location: 'Localisation actuelle',
                unknownCommune: 'Commune inconnue',
                noLocation: 'Localisation non renseignée',
                postalCode: 'Code postal :code',
                openMaps: 'Ouvrir dans Google Maps →',
                mapNote:
                    'La carte situe la commune de rattachement du bovin.',
                mapTitle: 'Carte de :place',
            },
        },
        dashboard: {
            title: 'Tableau de bord',
            eyebrow: 'Tableau de bord',
            greeting: 'Bonjour, :name.',
            description:
                'Visualisez la répartition du cheptel par découpage administratif et son évolution dans le temps.',
            distribution: {
                title: 'Répartition du cheptel',
                description:
                    'Nombre de bovins par niveau géographique.',
                province: 'Province',
                region: 'Région',
                district: 'District',
                showAll: 'Tout afficher (:count)',
                showLess: 'Réduire',
            },
            evolution: {
                title: 'Évolution du cheptel',
                description: 'Bovins nés et/ou morts par année.',
                metric: 'Afficher',
                born: 'Nés',
                deaths: 'Morts',
                both: 'Les deux',
                from: 'De',
                to: 'À',
                update: 'Mettre à jour',
                startAfterEnd:
                    'L’année de début doit précéder l’année de fin.',
            },
            loading: 'Chargement…',
            noData: 'Aucune donnée.',
        },
        eleveurs: {
            index: {
                title: 'Éleveurs',
                eyebrow: 'Éleveurs',
                heading: 'Les éleveurs du registre.',
                description:
                    'Chaque utilisateur peut détenir plusieurs bovins. Ouvrez sa fiche pour voir son cheptel et lui assigner une nouvelle bête.',
                create: 'Ajouter un éleveur',
                searchLabel: 'Rechercher un éleveur par CIN',
                search: 'Rechercher',
                searching: 'Recherche…',
                reset: 'Réinitialiser',
                resetSearch: 'Réinitialiser la recherche',
                count: ':from–:to sur :total :label',
                singular: 'éleveur',
                plural: 'éleveurs',
                cinMissing: 'non renseigné',
                assigned: 'Assignés à cet utilisateur',
                view: 'Voir la fiche →',
                bovinSingular: 'bovin',
                bovinPlural: 'bovins',
                emptySearchTitle: 'Aucun éleveur pour ce CIN.',
                emptyTitle: 'Aucun éleveur inscrit.',
                emptySearchText:
                    'Vérifiez le numéro saisi ou réinitialisez la recherche.',
                emptyText:
                    'Créez un utilisateur, puis rattachez-lui un ou plusieurs bovins depuis sa fiche.',
                addFirst: 'Ajouter le premier utilisateur',
                previous: 'Précédent',
                next: 'Suivant',
                page: 'Page :current sur :last',
                pagination: 'Pagination des utilisateurs',
            },
            create: {
                title: 'Ajouter un utilisateur',
                back: 'Retour aux utilisateurs',
                eyebrow: 'Nouvel éleveur',
                heading: 'Inscrire un éleveur.',
                description:
                    "L'utilisateur est enregistré comme employé : il ne se connecte pas à l'application. Vous pourrez ensuite lui assigner plusieurs bovins.",
                name: 'Nom complet',
                cin: 'Numéro CIN',
                cinHelp:
                    "Le CIN identifie l'utilisateur dans le registre et permet de le retrouver rapidement.",
                email: 'E-mail',
                emailHelp: "Cette adresse sert d'identifiant de connexion.",
                saving: 'Enregistrement…',
                submit: "Ajouter l'utilisateur",
                cancel: 'Annuler',
            },
            edit: {
                title: 'Modifier :name',
                back: 'Retour à la fiche',
                eyebrow: "Modification de l'éleveur",
                heading: 'Modifier :name.',
                name: 'Nom complet',
                cin: 'Numéro CIN',
                email: 'E-mail',
                saving: 'Enregistrement…',
                submit: 'Enregistrer les modifications',
                cancel: 'Annuler',
            },
            show: {
                back: 'Tous les éleveurs',
                eyebrow: 'Éleveur',
                cin: 'CIN',
                cinMissing: 'non renseigné',
                edit: 'Modifier',
                assign: 'Assigner un bovin',
                delete: 'Supprimer',
                deleteTitle: 'Supprimer cet éleveur ?',
                deleteText:
                    'Cette action supprimera également ses bovins assignés. Confirmez pour continuer.',
                confirmDelete: 'Confirmer la suppression',
                deleting: 'Suppression…',
                cancel: 'Annuler',
                statsBoucles: 'Boucles',
                statsFemelles: 'Femelles',
                statsMales: 'Mâles',
                bovinsHeading: 'Bovins de :name',
                count: ':from–:to sur :total',
                born: 'naissance',
                dead: 'Mort',
                alive: 'Vivant',
                noBovinsTitle: 'Aucun bovin assigné.',
                noBovinsText:
                    'Cet utilisateur peut recevoir plusieurs bêtes. Ouvrez une fiche bovine pour lui en assigner une.',
                assignFirst: 'Assigner un premier bovin',
                previous: 'Précédent',
                next: 'Suivant',
                page: 'Page :current sur :last',
                pagination: 'Pagination des bovins de l’utilisateur',
            },
        },
    },
    mg: {
        nav: {
            brandTagline: 'REJISTRA OMBY',
            dashboard: 'Tabilao',
            registry: 'Rejistra',
            registryBovin: 'Rejistra omby',
            breeders: 'Mpiompy',
            users: 'Mpampiasa',
            profile: 'Mombamomba',
            myProfile: 'Ny mombamomba ahy',
            logout: 'Hiala',
            openMenu: 'Hanokatra ny menio',
            closeMenu: 'Hanidy ny menio',
        },
        profile: {
            title: 'Ny mombamomba anao',
            subtitle:
                'Ny fampahalalana mifandray amin’ny fidiranao amin’ny rejistra omby.',
            preferences: {
                title: 'Safidy',
                description:
                    'Safidio ny endrik’ny sehatra sy ny fiteny aseho.',
                theme: 'Endrika',
                themeDescription:
                    'Amboary ny endrika mifanaraka amin’ny famakianao.',
                light: 'Mazava',
                dark: 'Maizina',
                language: 'Fiteny',
                languageDescription: 'Safidio ny fitenin’ny sehatra.',
                french: 'Frantsay',
                malagasy: 'Malagasy',
            },
            information: {
                title: 'Fampahalalana momba ny mombamomba',
                description:
                    'Ny anaranao sy ny adiresy imailaka mifandray amin’ny fidiranao.',
                name: 'Anarana feno',
                email: 'Adiresy imailaka',
                save: 'Tehirizo',
                saving: 'Mitehirizana…',
                saved: 'Voatahiry.',
                unverified: 'Tsy mbola voamarina ny adiresy imailakanao.',
                resend: 'Halefao indray ny rohy fanamarinana.',
                resent: 'Nalefa ny rohy fanamarinana vaovao.',
            },
            password: {
                title: 'Tenimiafina',
                description:
                    'Ampiasao tenimiafina lava sy tsy manam-paharoa hiarovana ny fidiranao amin’ny rejistra.',
                current: 'Tenimiafina ankehitriny',
                new: 'Tenimiafina vaovao',
                confirm: 'Hamafiso ny tenimiafina vaovao',
                submit: 'Havaozina',
                submitting: 'Manavao…',
                saved: 'Voatahiry.',
            },
            delete: {
                title: 'Hamafa ny kaonty',
                description:
                    'Tsy azo ivalozana ny famafana. Ho very ny angona mifandray amin’ny kaontinao. Alaina aloha izay tianao hotehirizina.',
                submit: 'Hamafa ny kaontiko',
                confirmTitle: 'Hamafiso ny famafana',
                confirmDescription:
                    'Tsy azo ivalozana ity hetsika ity. Ampidiro ny tenimiafinao hamafana tanteraka ny kaontinao.',
                password: 'Tenimiafina',
                passwordPlaceholder: 'Ny tenimiafinao',
                cancel: 'Hanafoana',
                confirm: 'Hamafa tanteraka',
                deleting: 'Mamafa…',
            },
        },
        bovins: {
            index: {
                title: 'Rejistra omby',
                eyebrow: 'Rejistra omby',
                heading: 'Ny omby voasoratra.',
                description:
                    'Ny boucle tsirairay dia manokatra rakitra tokana : maha-izy, fiaviana, toerana ary fanarahan-dia ara-pahasalamana.',
                breeders: 'Ny mpiompy',
                create: 'Hanoratra omby',
                searchLabel: 'Hikaroka omby amin’ny laharana boucle',
                searchPlaceholder: '101-1',
                search: 'Hikaroka',
                searching: 'Mikaroka…',
                reset: 'Avereno',
                resetSearch: 'Avereno ny fikarohana',
                statsTotal: 'Omby',
                statsFemelles: 'Vavy',
                statsMales: 'Lahy',
                female: 'Vavy',
                male: 'Lahy',
                count: ':from–:to amin’ny :total :label',
                bovinSingular: 'omby',
                bovinPlural: 'omby',
                assigned: 'Voasoratra amin’ny tompony',
                boucle: 'Laharana boucle',
                born: 'teraka',
                viewRecord: 'Hijery ny rakitra →',
                alive: 'Velona',
                dead: 'Maty',
                previous: 'Teo aloha',
                next: 'Manaraka',
                page: 'Pejy :current amin’ny :last',
                emptySearchTitle: 'Tsy misy omby amin’ity boucle ity.',
                emptyTitle: 'Tsy misy omby ao amin’ny rejistra.',
                emptySearchText:
                    'Hamarinonao ny laharana na haverinao ny fikarohana.',
                emptyText:
                    'Soraty aloha ny mpampiasa, dia asio omby iray na maromaro. Ny tompony no fiandohan’ny rejistra.',
                addUser: 'Hanampy mpampiasa',
            },
            create: {
                title: 'Hanoratra omby',
                back: 'Hiverina amin’ny rejistra',
                eyebrow: 'Rakitra vaovao',
                heading: 'Hanokatra boucle omby.',
                description:
                    'Manana tompony ny omby tsirairay. Ny boucle dia foronina ho azy avy amin’ny kaody paositra an’ny distrika sy ny laharana an’ilay biby ; safidio ny toerana ary fenoy ny rakitra ara-pahasalamany.',
                ownerSection: 'Tompony',
                noUsers:
                    'Tsy mbola misy mpampiasa voasoratra. Mamoròna ny kaontiny aloha, dia hiverina hanome azy omby.',
                createUser: 'Hamorona mpampiasa',
                ownerLabel: 'Mpampiasa tompony',
                chooseUser: 'Misafidiana mpampiasa',
                ownerHelp:
                    'Ny mpampiasa iray dia afaka manana omby maromaro.',
                identification: 'Fanamarinana',
                sex: 'Lahy / Vavy',
                birthDate: 'Daty nahaterahana',
                deathDate: 'Daty nahafatesana (tsy voatery)',
                location: 'Toerana',
                noLocation: 'Tsy misy toerana misy. Alefaso',
                noLocationAfter:
                    'hametrahana ny fizarana ara-pitantanana.',
                province: 'Faritany',
                region: 'Faritra',
                district: 'Distrika',
                commune: 'Kaominina',
                chooseProvince: 'Misafidiana faritany',
                chooseRegion: 'Misafidiana faritra',
                chooseDistrict: 'Misafidiana distrika',
                chooseCommune: 'Misafidiana kaominina',
                firstProvince: 'Ny faritany aloha',
                firstRegion: 'Ny faritra aloha',
                firstDistrict: 'Ny distrika aloha',
                earTagNote:
                    'Ny boucle dia hoforonina rehefa voatahiry : kaody paositra an’ny distrika + laharana manokana an’ilay omby (ohatra 101-1).',
                signsHealth: 'Mari-pahitana sy fahasalamana',
                signs: 'Mari-pahitana manokana (tsy voatery)',
                signsHelp:
                    'Mari iray isaky ny andalana, hahafantarana tsara an’ilay biby.',
                health: 'Rakitra ara-pahasalamana (tsy voatery)',
                healthHelp: 'Naoty fanarahan-dia iray isaky ny andalana.',
                saving: 'Mitehirizana…',
                submit: 'Tehirizo ny omby',
                cancel: 'Hanafoana',
                tagLabel: 'BOKINOMBY · RAKITRA VAOVAO',
                tagOwner: 'Tompony tsy voafaritra',
                tagSex: 'Lahy / Vavy',
                tagBirth: 'Nahaterahana',
                tagCommune: 'Kaominina',
                tagDistrict: 'Distrika',
                tagFooter: 'BOUCLE FORONINA REHEFA VOATAHIRY',
                aside1:
                    'Ny boucle dia omen’ny fampiharana ho azy, avy amin’ny kaody paositra an’ny distrika voafidy.',
                aside2:
                    'Ny mpampiasa iray dia afaka mandray omby maromaro : hiverina amin’ny rakiny hameno ny biby fiompiny.',
                aside3:
                    'Ny mari-pahitana manokana sy ny rakitra ara-pahasalamana dia azo fenoina isaky ny fitsidihana.',
            },
            edit: {
                title: 'Hanova :boucle',
                back: 'Hiverina amin’ny rakitra',
                eyebrow: 'Fanovana ny rakitra',
                heading: 'Hanova :boucle.',
                sex: 'Lahy / Vavy',
                dates: 'Daty',
                birthDate: 'Daty nahaterahana',
                deathDate: 'Daty nahafatesana (tsy voatery)',
                signsHealth: 'Mari-pahitana sy fahasalamana',
                signs: 'Mari-pahitana manokana (tsy voatery)',
                health: 'Rakitra ara-pahasalamana (tsy voatery)',
                saving: 'Mitehirizana…',
                submit: 'Tehirizo ny fanovana',
                cancel: 'Hanafoana',
            },
            show: {
                title: 'Rakitra omby',
                back: 'Hiverina amin’ny rejistra',
                eyebrow: 'Rakitra omby',
                boucleSex: 'Laharana boucle · :sex',
                alive: 'Velona',
                dead: 'Maty',
                edit: 'Ovaina',
                delete: 'Fafao',
                deleteTitle: 'Hamafa ity omby ity ?',
                deleteText:
                    'Tsy azo ivalozana ity hetsika ity. Hotehirizina ny tantaran’ny rakitra.',
                confirmDelete: 'Hamafiso ny famafana',
                deleting: 'Mamafa…',
                cancel: 'Hanafoana',
                identity: 'Maha-izy',
                owner: 'Tompony',
                earTag: 'Laharana boucle',
                sex: 'Lahy / Vavy',
                birthDate: 'Daty nahaterahana',
                deathDate: 'Daty nahafatesana',
                noDeath: 'Tsy misy — velona ny biby.',
                signs: 'Mari-pahitana manokana',
                noSigns: 'Tsy misy mari-pahitana manokana voaray.',
                health: 'Toe-pahasalamana',
                noHealth:
                    'Tsy misy fanarahan-dia ara-pahasalamana voatahiry ho an’ity biby ity.',
                history: 'Tantaran’ny fanovana',
                noHistory: 'Tsy misy tantara voatahiry ho an’ity biby ity.',
                location: 'Toerana ankehitriny',
                unknownCommune: 'Tsy fantatra ny kaominina',
                noLocation: 'Tsy voalaza ny toerana',
                postalCode: 'Kaody paositra :code',
                openMaps: 'Sokafy ao amin’ny Google Maps →',
                mapNote:
                    'Ny sarintany dia mampiseho ny kaominina misy an’ilay omby.',
                mapTitle: 'Sarintany :place',
            },
        },
        dashboard: {
            title: 'Tabilao',
            eyebrow: 'Tabilao',
            greeting: 'Manao ahoana, :name.',
            description:
                'Jereo ny fizarana ny biby fiompy amin’ny fizarana ara-pitantanana sy ny fiovany rehefa mandeha ny fotoana.',
            distribution: {
                title: 'Fizarana ny biby fiompy',
                description:
                    'Isan’ny omby isaky ny ambaratonga ara-jeografika.',
                province: 'Faritany',
                region: 'Faritra',
                district: 'Distrika',
                showAll: 'Aseho daholo (:count)',
                showLess: 'Ahena',
            },
            evolution: {
                title: 'Fiovan’ny biby fiompy',
                description: 'Omby teraka sy/na maty isan-taona.',
                metric: 'Aseho',
                born: 'Teraka',
                deaths: 'Maty',
                both: 'Izy roa',
                from: 'Avy amin’ny',
                to: 'Hatramin’ny',
                update: 'Havaozina',
                startAfterEnd:
                    'Tsy maintsy mialoha ny taonan’ny farany ny taonan’ny fanombohana.',
            },
            loading: 'Mampiditra…',
            noData: 'Tsy misy angona.',
        },
        eleveurs: {
            index: {
                title: 'Mpiompy',
                eyebrow: 'Mpiompy',
                heading: 'Ny mpiompy ao amin’ny rejistra.',
                description:
                    'Ny mpampiasa tsirairay dia afaka manana omby maromaro. Sokafy ny rakiny hijery ny biby fiompiny sy hanomezana azy omby vaovao.',
                create: 'Hanampy mpiompy',
                searchLabel: 'Hikaroka mpiompy amin’ny CIN',
                search: 'Hikaroka',
                searching: 'Mikaroka…',
                reset: 'Avereno',
                resetSearch: 'Avereno ny fikarohana',
                count: ':from–:to amin’ny :total :label',
                singular: 'mpiompy',
                plural: 'mpiompy',
                cinMissing: 'tsy voalaza',
                assigned: 'Voasoratra amin’ity mpampiasa ity',
                view: 'Hijery ny rakiny →',
                bovinSingular: 'omby',
                bovinPlural: 'omby',
                emptySearchTitle: 'Tsy misy mpiompy amin’ity CIN ity.',
                emptyTitle: 'Tsy misy mpiompy voasoratra.',
                emptySearchText:
                    'Hamarinonao ny laharana na haverinao ny fikarohana.',
                emptyText:
                    'Mamorona mpampiasa, dia ampiarahy aminy omby iray na maromaro avy amin’ny rakiny.',
                addFirst: 'Hanampy mpampiasa voalohany',
                previous: 'Teo aloha',
                next: 'Manaraka',
                page: 'Pejy :current amin’ny :last',
                pagination: 'Fizarana pejy ny mpampiasa',
            },
            create: {
                title: 'Hanampy mpampiasa',
                back: 'Hiverina amin’ny mpampiasa',
                eyebrow: 'Mpiompy vaovao',
                heading: 'Hisoratra mpiompy.',
                description:
                    'Voasoratra ho mpiasa ny mpampiasa : tsy miditra amin’ny fampiharana izy. Azo atao avy eo ny manome azy omby maromaro.',
                name: 'Anarana feno',
                cin: 'Laharana CIN',
                cinHelp:
                    'Ny CIN no mampiavaka ny mpampiasa ao amin’ny rejistra ary mamela ny fitadiavana haingana azy.',
                email: 'Imailaka',
                emailHelp: 'Ity adiresy ity no ampiasaina hidirana.',
                saving: 'Mitehirizana…',
                submit: 'Hanampy ny mpampiasa',
                cancel: 'Hanafoana',
            },
            edit: {
                title: 'Hanova :name',
                back: 'Hiverina amin’ny rakitra',
                eyebrow: 'Fanovana ny mpiompy',
                heading: 'Hanova :name.',
                name: 'Anarana feno',
                cin: 'Laharana CIN',
                email: 'Imailaka',
                saving: 'Mitehirizana…',
                submit: 'Tehirizo ny fanovana',
                cancel: 'Hanafoana',
            },
            show: {
                back: 'Mpiompy rehetra',
                eyebrow: 'Mpiompy',
                cin: 'CIN',
                cinMissing: 'tsy voalaza',
                edit: 'Ovaina',
                assign: 'Hanome omby',
                delete: 'Fafao',
                deleteTitle: 'Hamafa ity mpiompy ity ?',
                deleteText:
                    'Hofafana koa ny omby voasoratra aminy. Hamafiso raha hanohy.',
                confirmDelete: 'Hamafiso ny famafana',
                deleting: 'Mamafa…',
                cancel: 'Hanafoana',
                statsBoucles: 'Omby',
                statsFemelles: 'Vavy',
                statsMales: 'Lahy',
                bovinsHeading: 'Omby an’i :name',
                count: ':from–:to amin’ny :total',
                born: 'teraka',
                dead: 'Maty',
                alive: 'Velona',
                noBovinsTitle: 'Tsy misy omby voasoratra.',
                noBovinsText:
                    'Ity mpampiasa ity dia afaka mandray omby maromaro. Sokafy ny rakitry ny omby hanomezana azy iray.',
                assignFirst: 'Hanome omby voalohany',
                previous: 'Teo aloha',
                next: 'Manaraka',
                page: 'Pejy :current amin’ny :last',
                pagination: 'Fizarana pejy ny omby an’ny mpampiasa',
            },
        },
    },
};

function lookup(dictionary, key) {
    return key
        .split('.')
        .reduce(
            (value, part) =>
                value && typeof value === 'object' ? value[part] : undefined,
            dictionary,
        );
}

export function translate(locale, key, replacements = {}) {
    const fallback = translations.fr;
    const dictionary = translations[locale] ?? fallback;
    const template = lookup(dictionary, key) ?? lookup(fallback, key) ?? key;

    return Object.entries(replacements).reduce(
        (text, [name, value]) => text.replaceAll(`:${name}`, String(value)),
        template,
    );
}

function readTheme() {
    if (typeof window === 'undefined') {
        return 'light';
    }

    try {
        const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
    } catch {
        // localStorage indisponible : on retombe sur la préférence système.
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

function readLocale() {
    if (typeof window === 'undefined') {
        return 'fr';
    }

    try {
        const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);

        if (LOCALES.includes(stored)) {
            return stored;
        }
    } catch {
        // localStorage indisponible : on garde le français.
    }

    return 'fr';
}

export function applyTheme(theme) {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.setAttribute(
        'data-theme',
        THEMES[theme] ?? THEMES.light,
    );
}

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
    const [theme, setTheme] = useState(readTheme);
    const [locale, setLocale] = useState(readLocale);

    useEffect(() => {
        applyTheme(theme);

        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch {
            // La préférence reste valable pour la session en cours.
        }
    }, [theme]);

    useEffect(() => {
        document.documentElement.setAttribute('lang', locale);

        try {
            window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
        } catch {
            // La préférence reste valable pour la session en cours.
        }
    }, [locale]);

    const value = useMemo(
        () => ({ theme, setTheme, locale, setLocale }),
        [theme, locale],
    );

    return (
        <PreferencesContext.Provider value={value}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);

    if (!context) {
        throw new Error(
            'usePreferences doit être utilisé dans un PreferencesProvider.',
        );
    }

    return context;
}

export function useTranslation() {
    const { locale } = usePreferences();

    const t = useCallback(
        (key, replacements) => translate(locale, key, replacements),
        [locale],
    );

    return { t, locale };
}
