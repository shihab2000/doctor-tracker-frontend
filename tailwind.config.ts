import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink: '#172033', muted: '#68738a', brand: '#3b82f6', canvas: '#f5f7fb' }, boxShadow: { soft: '0 8px 30px rgba(24,39,75,.06)' } } }, plugins: [] };
export default config;
