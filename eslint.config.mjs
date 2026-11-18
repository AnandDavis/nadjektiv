import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const RAW_HUE_CLASS =
  '/\\b(?:bg|text|border|ring|fill|stroke|from|to|via|outline|decoration)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\\d{2,3}\\b/';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Persistence goes through the ProgressStore port (CLAUDE.md rule 4).
      'no-restricted-globals': [
        'error',
        { name: 'localStorage', message: 'Use the ProgressStore in @/lib/storage.' },
        { name: 'sessionStorage', message: 'Use the ProgressStore in @/lib/storage.' },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'window',
          property: 'localStorage',
          message: 'Use the ProgressStore in @/lib/storage.',
        },
      ],
    },
  },
  {
    files: ['src/components/**/*.tsx', 'src/app/**/*.tsx'],
    rules: {
      // Colours come from design tokens (CLAUDE.md rule 6).
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=${RAW_HUE_CLASS}]`,
          message:
            'Use a design token utility (bg-surface, text-muted …) instead of a raw Tailwind hue.',
        },
        {
          selector: 'Literal[value=/(^|\\s)(rounded|shadow)(-[a-z0-9]+)?($|\\s)/]',
          message: 'No rounded corners or shadows: the design is flat and square (docs/DESIGN.md).',
        },
        {
          selector: 'Literal[value=/#[0-9a-fA-F]{6}\\b/]',
          message: 'No hex colours in components — add a token to globals.css.',
        },
      ],
    },
  },
  {
    files: [
      'src/lib/storage/**',
      'src/app/layout.tsx',
      '**/*.test.{ts,tsx}',
      'e2e/**',
      'vitest.setup.ts',
    ],
    rules: { 'no-restricted-globals': 'off', 'no-restricted-properties': 'off' },
  },
  {
    // Node scripts and test suites report to the terminal.
    files: ['scripts/**', 'e2e/**'],
    rules: { 'no-console': 'off' },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',

    'playwright-report/**',
    'test-results/**',
    'coverage/**',
  ]),
]);

export default eslintConfig;
