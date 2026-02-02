/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                main: 'var(--text-main)',
                muted: 'var(--text-muted)',
                'bg-dark': 'var(--bg-dark)',
                'bg-card': 'var(--bg-card)',
                'bg-card-hover': 'var(--bg-card-hover)',
            }
        },
    },
    plugins: [],
}
