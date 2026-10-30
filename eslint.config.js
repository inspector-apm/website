import eslintPluginAstro from 'eslint-plugin-astro';

export default [{ ignores: ['.next'] }, ...eslintPluginAstro.configs.recommended];
