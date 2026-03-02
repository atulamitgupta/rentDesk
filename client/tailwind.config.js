/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // Brand palette — Orange + Warm White
                brand: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',   // PRIMARY ORANGE
                    600: '#ea6c0a',
                    700: '#c2570c',
                    800: '#9a3a0e',
                    900: '#7c2d12',
                },
                warm: {
                    50: '#fafaf9',
                    100: '#f8f8f7',   // WARM WHITE — main background
                    200: '#f0efed',
                    300: '#e6e4e0',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'brand-sm': '0 1px 3px 0 rgb(249 115 22 / 0.15)',
                'brand-md': '0 4px 12px 0 rgb(249 115 22 / 0.2)',
                'brand-lg': '0 8px 24px 0 rgb(249 115 22 / 0.25)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
        },
    },
    plugins: [],
};
