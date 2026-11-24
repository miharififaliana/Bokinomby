# Bokinomby — Registre bovin numérique

Bokinomby est une application de recensement bovin pensée pour Kinshasa. Elle
réunit l'identité d'une bête, sa localisation administrative (district, commune,
quartier) et son dossier de santé dans un registre unique.

L'interface est construite avec **Laravel 11**, **Inertia.js**, **React 18**,
**Tailwind CSS 3**, **daisyUI 4** et **Framer Motion**.

## Fonctionnalités disponibles

- **Authentification complète** : inscription, connexion, déconnexion,
  réinitialisation du mot de passe, confirmation du mot de passe.
- **Vérification d'e-mail** : les écrans et les routes existent, mais la
  vérification n'est pas imposée tant que le modèle `User` n'implémente pas
  `MustVerifyEmail`.
- **Profil utilisateur** : modification du nom et de l'e-mail, changement de mot
  de passe, suppression du compte avec confirmation par mot de passe.
- **Rôles** : `admin` et `employer` (valeur par défaut). Le rôle est affiché
  dans l'interface ; il ne restreint pas encore l'accès aux données.
- **Utilisateurs** : chaque propriétaire est un utilisateur (nom, CIN,
  e-mail) ; liste recherchable par CIN et fiche détaillant tous les bovins qui
  lui sont assignés.
- **Registre bovin** : liste paginée du cheptel et formulaire d'enregistrement
  d'un bovin (utilisateur propriétaire, boucle générée automatiquement, sexe,
  dates, localisation administrative, signes particuliers, dossier de santé).
  La modification et la suppression des fiches ne sont pas encore exposées.
- **Interface premium** : page d'accueil éditoriale, pages d'authentification,
  utilisateurs, registre, tableau de bord et profil, avec animations respectant
  `prefers-reduced-motion`.

## Prérequis

- PHP **8.2 ou supérieur** avec l'extension `pdo_sqlite`
- [Composer](https://getcomposer.org/)
- Node.js **18 ou supérieur** et npm
- Un terminal compatible Bash (Linux, macOS, WSL, Git Bash)

## Installation

Depuis la racine du projet :

```bash
# 1. Dépendances PHP
composer install

# 2. Configuration de l'environnement
cp .env.example .env
php artisan key:generate

# 3. Base de données SQLite
touch database/database.sqlite
php artisan migrate --seed

# 4. Dépendances front-end et build de production
npm install
npm run build

# 5. Démarrage
php artisan serve
```

L'application est accessible sur **http://localhost:8000**.

### Mode développement

Pour recharger automatiquement l'interface pendant les modifications, lancez
deux terminaux :

```bash
# Terminal 1 — serveur Laravel
php artisan serve

# Terminal 2 — serveur Vite
npm run dev
```

Sans `npm run dev`, l'application utilise les fichiers compilés par
`npm run build`. Si vous modifiez les fichiers JSX/CSS et que la page ne change
pas, relancez `npm run build` ou démarrez Vite.

### Sous Windows

```powershell
copy .env.example .env
New-Item database/database.sqlite
```

Le reste des commandes est identique (Git Bash ou PowerShell avec PHP dans le
`PATH`).

## Compte de démonstration

Le seeder crée un compte de démonstration et un jeu de départ de localités :

| E-mail             | Mot de passe |
| ------------------ | ------------ |
| `test@example.com` | `password`   |

Ce compte a le rôle `employer`. Pour lui donner le rôle administrateur :

```bash
php artisan tinker --execute="App\Models\User::where('email', 'test@example.com')->update(['role' => 'admin']);"
```

Vous pouvez aussi créer un compte depuis `/register`.

Le découpage de départ couvre 4 districts, 17 communes et 34 quartiers de
Kinshasa. Il n'est pas exhaustif : complétez les tables `districts`,
`communes` et `quartiers` selon le terrain couvert par votre registre.

## Authentification : parcours et routes

Toutes les pages d'authentification sont fournies par Laravel Breeze et
Inertia. Les invités sont redirigés vers `/login` lorsqu'ils ouvrent une page
protégée.

| Méthode | URL | Rôle |
| ------- | --- | ---- |
| `GET` | `/register` | Formulaire d'inscription (invité) |
| `POST` | `/register` | Création du compte puis connexion automatique |
| `GET` | `/login` | Formulaire de connexion (invité) |
| `POST` | `/login` | Connexion (5 tentatives par minute et par IP/e-mail) |
| `POST` | `/logout` | Déconnexion d'un utilisateur connecté |
| `GET` | `/forgot-password` | Demande de lien de réinitialisation |
| `POST` | `/forgot-password` | Envoi de l'e-mail de réinitialisation |
| `GET` | `/reset-password/{token}` | Formulaire de nouveau mot de passe |
| `POST` | `/reset-password` | Enregistrement du nouveau mot de passe |
| `GET` | `/verify-email` | Rappel de vérification d'e-mail |
| `GET` | `/verify-email/{id}/{hash}` | Lien signé de vérification |
| `POST` | `/email/verification-notification` | Renvoi de l'e-mail de vérification |
| `GET` | `/confirm-password` | Confirmation du mot de passe |
| `POST` | `/confirm-password` | Validation de la confirmation |
| `PUT` | `/password` | Changement du mot de passe depuis le profil |
| `GET` | `/dashboard` | Tableau de bord (connecté) |
| `GET` | `/bovins` | Registre bovin (connecté) |
| `GET` | `/bovins/create` | Formulaire d'enregistrement d'un bovin |
| `POST` | `/bovins` | Enregistrement d'un bovin |
| `GET` | `/utilisateurs` | Liste des utilisateurs propriétaires |
| `GET` | `/utilisateurs/create` | Formulaire de création d'un utilisateur |
| `POST` | `/utilisateurs` | Enregistrement d'un utilisateur |
| `GET` | `/utilisateurs/{utilisateur}` | Fiche d'un utilisateur et de ses bovins |
| `GET` | `/profile` | Profil (connecté) |
| `PATCH` | `/profile` | Mise à jour du nom et de l'e-mail |
| `DELETE` | `/profile` | Suppression du compte |

### Réinitialisation du mot de passe en local

Par défaut, `MAIL_MAILER=log` : aucun e-mail n'est envoyé, le message est écrit
dans les logs. Après une demande depuis `/forgot-password`, récupérez le lien :

```bash
grep -oE 'https?://[^ "<>]*reset-password[^ "<>]*' storage/logs/laravel.log | tail -1
```

L'URL utilise l'hôte de la requête (par exemple `http://127.0.0.1:8000` ou
`http://localhost:8000`). Si vous copiez le lien depuis le rendu HTML de
l'e-mail dans le log, remplacez `&amp;` par `&` avant de l'ouvrir.

Pour envoyer de vrais e-mails, renseignez les variables `MAIL_*` dans `.env`
(par exemple avec Mailpit en local) puis :

```bash
php artisan config:clear
```

### Vérification d'e-mail

Le modèle `User` n'utilise pas le contrat `MustVerifyEmail`. Les routes et les
écrans de vérification restent accessibles, mais un compte non vérifié peut
accéder au tableau de bord. Pour imposer la vérification, décommentez
`implements MustVerifyEmail` dans `app/Models/User.php` et ajoutez l'interface
correspondante.

## Utilisateurs et affectation des bovins

Chaque propriétaire est un utilisateur de l'application, identifié par son CIN.
Il n'existe plus de table `personnes` séparée. Le parcours habituel est :

1. **Ajouter un utilisateur** depuis `/utilisateurs` (nom, CIN et e-mail
   obligatoires, mot de passe pour la connexion) ;
2. ouvrir sa fiche, puis cliquer sur **Assigner un bovin** ;
3. renseigner le dossier du bovin ; l'utilisateur est présélectionné ;
4. répéter l'opération autant de fois que nécessaire. Tous ses bovins
   apparaissent sur sa fiche, avec les compteurs total/femelles/mâles.

Un utilisateur peut donc détenir plusieurs bovins. Le propriétaire se choisit
dans le formulaire bovin. La suppression d'un utilisateur supprime ses bovins
en cascade.

## Registre bovin

Depuis `/bovins`, un utilisateur connecté consulte le registre et ouvre une
nouvelle fiche avec **Enregistrer un bovin**. Les champs sont :

- **utilisateur propriétaire** obligatoire ;
- **numéro de boucle** généré automatiquement (code postal + numéro du bovin) ;
- **sexe** (`femelle` ou `male`) et **date de naissance** ;
- **date de décès** facultative, qui ne peut pas précéder la naissance ;
- **district → commune → quartier**, avec des listes dépendantes ;
- **signes particuliers** et **dossier de santé**, facultatifs, saisis une
  ligne par entrée.

Si le formulaire signale qu'aucun quartier n'est disponible, chargez le
découpage de démonstration :

```bash
php artisan db:seed --class=LocationSeeder
```

Les fiches sont stockées dans la table `bovins`. La liste est paginée par 12 et
les compteurs (total, femelles, mâles) portent sur l'ensemble du registre.

## Modèle de données

| Table | Champs principaux |
| ----- | ----------------- |
| `users` | `name`, `email`, `cin`, `password`, `role` (`admin` / `employer`) |
| `districts` | `name` |
| `communes` | `district_id`, `name` |
| `quartiers` | `commune_id`, `name` |
| `bovins` | `numero_boucle` (unique), `proprietaire_id`, `sexe`, `signe_particulier` (JSON), `date_naissance`, `date_deces`, `dossier_sante` (JSON), `quartier_id` |

`signe_particulier` et `dossier_sante` sont des listes JSON : chaque ligne
saisie dans le formulaire devient une entrée.

La chaîne est `User → Bovin` et `District → Commune → Bovin`.
Un bovin appartient à un utilisateur via `proprietaire_id` ; un utilisateur peut
avoir plusieurs bovins. La suppression d'un utilisateur supprime ses bovins en
cascade.

La migration `2026_11_25_000000_use_users_as_bovin_owners` reprend les données
de l'ancienne table `personnes`, rattache les bovins aux utilisateurs
correspondants (par CIN puis par e-mail), puis supprime la table `personnes`.

Commandes utiles :

```bash
php artisan migrate           # appliquer les migrations
php artisan migrate:fresh --seed   # ATTENTION : efface et recrée la base
php artisan db:seed           # compte de démonstration + localités
php artisan db:seed --class=LocationSeeder   # localités seules
```

## Tests et vérifications

```bash
php artisan test     # suite Pest (35 tests)
npm run build        # vérifie la compilation front-end
```

Les tests utilisent une base SQLite en mémoire (`phpunit.xml`) et ne touchent
pas à la base de développement.

## Structure du projet

```text
app/
  Http/Controllers/          # Authentification, profil, utilisateurs, bovins
  Http/Middleware/           # Partage des props Inertia
  Models/                    # User, Bovin, Province, Region, District, Commune
database/
  migrations/                # Schéma SQLite/MySQL
  seeders/                   # Compte et localités de démonstration
lang/fr/                     # Messages de validation et d'authentification
resources/
  css/app.css                # Base Tailwind + thème
  js/
    Components/              # Boutons, champs, boucle d'oreille (EarTag)
    Layouts/                 # Coques invité et authentifié
    Pages/                   # Accueil, Auth, Bovins, Utilisateurs, Dashboard, Profile
  views/app.blade.php        # Document racine Inertia
routes/
  web.php                    # Accueil, dashboard, utilisateurs, registre, profil
  auth.php                   # Routes d'authentification
```

## Thème et direction artistique

Le thème daisyUI `bokinomby` est défini dans `tailwind.config.js` (papier
ivoire, vert pâturage, laiton). Les polices **Fraunces** et **Public Sans** sont
chargées depuis Bunny Fonts. La boucle d'oreille du registre est le composant
signature (`resources/js/Components/EarTag.jsx`).

Le skill de design `frontend-design` est installé dans
`.agents/skills/frontend-design` (avec un lien pour Claude Code dans `.claude/`).

## Dépannage

| Problème | Solution |
| -------- | -------- |
| `Vite manifest not found` | Lancez `npm run build` ou `npm run dev` |
| Erreur `419 Page Expired` | Vérifiez `APP_KEY` (`php artisan key:generate`), les cookies et la session |
| `Database file does not exist` | Créez `database/database.sqlite` puis `php artisan migrate` |
| Table `sessions` manquante | Lancez `php artisan migrate` (le driver de session est `database`) |
| E-mail de réinitialisation absent | Consultez `storage/logs/laravel.log` (`MAIL_MAILER=log`) |
| Modification des styles sans effet | Relancez `npm run build`, ou videz le cache navigateur |
| Permissions en production | Rendez `storage/` et `bootstrap/cache/` accessibles en écriture |
| Configuration obsolète | Lancez `php artisan config:clear` |
