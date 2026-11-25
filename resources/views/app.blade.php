<!DOCTYPE html>
<html lang="fr" data-theme="bokinomby">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#24513C">
        <meta name="description" content="Bokinomby, le registre bovin numérique de Kinshasa : identité, localisation et suivi sanitaire des bêtes.">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">

        <script>
            (function () {
                try {
                    var stored = localStorage.getItem('bokinomby.theme');
                    var dark = stored
                        ? stored === 'dark'
                        : window.matchMedia('(prefers-color-scheme: dark)').matches;

                    document.documentElement.setAttribute(
                        'data-theme',
                        dark ? 'bokinomby-dark' : 'bokinomby'
                    );

                    var locale = localStorage.getItem('bokinomby.locale');
                    if (locale === 'mg') {
                        document.documentElement.setAttribute('lang', 'mg');
                    }
                } catch (error) {
                    // Préférences indisponibles : thème et langue par défaut.
                }
            })();
        </script>

        <title inertia>{{ config('app.name', 'Bokinomby') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=fraunces:400,500,600,700|public-sans:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
