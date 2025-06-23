import eslintPluginImportNewlines from 'eslint-plugin-import-newlines';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';

export default [
    {
        ignores: ['node_modules/**', 'dist/**'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptEslintParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
            'import-newlines': eslintPluginImportNewlines,
        },
        rules: {
            'no-console': 'warn',
            'no-debugger': 'warn',
            'no-trailing-spaces': 'error',
            '@typescript-eslint/no-unused-vars': 'warn',
            'comma-dangle': ['error', 'always-multiline'],
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            'import-newlines/enforce': ['error', { items: 50 }],
        },
    },
];
