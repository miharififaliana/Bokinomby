import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Public Sans', ...defaultTheme.fontFamily.sans],
                display: ['Fraunces', ...defaultTheme.fontFamily.serif],
            },
        },
    },

    plugins: [forms, daisyui],

    daisyui: {
        logs: false,
        themes: [
            {
                bokinomby: {
                    primary: '#24513C',
                    'primary-content': '#F6F2E7',
                    secondary: '#B08A4F',
                    'secondary-content': '#1B241E',
                    accent: '#8C3A30',
                    'accent-content': '#F8F1E4',
                    neutral: '#1C2B23',
                    'neutral-content': '#F6F2E7',
                    'base-100': '#F6F2E7',
                    'base-200': '#EDE6D6',
                    'base-300': '#DCD1BC',
                    'base-content': '#19261F',
                    info: '#3E6B7A',
                    success: '#2E6B4F',
                    warning: '#A87C3F',
                    error: '#8C3A30',
                    '--rounded-box': '1.5rem',
                    '--rounded-btn': '9999px',
                    '--rounded-badge': '9999px',
                    '--border-btn': '1px',
                    '--btn-text-case': 'none',
                    '--animation-btn': '0.2s',
                },
            },
            {
                'bokinomby-dark': {
                    'color-scheme': 'dark',
                    primary: '#7CB69A',
                    'primary-content': '#0E1712',
                    secondary: '#D3AE6F',
                    'secondary-content': '#171208',
                    accent: '#D98A7F',
                    'accent-content': '#1B0F0D',
                    neutral: '#22312A',
                    'neutral-content': '#EDE9DC',
                    'base-100': '#0F1713',
                    'base-200': '#151F19',
                    'base-300': '#1E2B24',
                    'base-content': '#EDE7D8',
                    info: '#7FB2C4',
                    success: '#79C49A',
                    warning: '#D9B36E',
                    error: '#E08A7E',
                    '--rounded-box': '1.5rem',
                    '--rounded-btn': '9999px',
                    '--rounded-badge': '9999px',
                    '--border-btn': '1px',
                    '--btn-text-case': 'none',
                    '--animation-btn': '0.2s',
                },
            },
        ],
    },
};
