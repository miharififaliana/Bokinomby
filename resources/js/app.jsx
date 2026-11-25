import '../css/app.css';
import './bootstrap';

import { PreferencesProvider, applyTheme } from '@/lib/i18n';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

applyTheme(
    (() => {
        try {
            const stored = window.localStorage.getItem('bokinomby.theme');

            if (stored === 'light' || stored === 'dark') {
                return stored;
            }
        } catch {
            // Ignore : préférence système utilisée par défaut.
        }

        return window.matchMedia?.('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    })(),
);

const appName = import.meta.env.VITE_APP_NAME || 'Bokinomby';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <PreferencesProvider>
                <App {...props} />
            </PreferencesProvider>,
        );
    },
    progress: {
        color: '#24513C',
    },
});
