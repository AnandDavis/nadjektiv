import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    coverage: {
      provider: 'v8',
      // Domain logic and content plumbing must be unit-tested. UI is covered by the
      // Playwright suites instead.
      include: ['src/lib/**/*.ts', 'src/content/*.ts', 'src/config/**/*.ts'],
      exclude: ['**/*.test.ts', '**/types.ts', 'src/lib/storage/progress-store.ts'],
      reporter: ['text-summary', 'text', 'html'],
      reportsDirectory: 'coverage',
      thresholds: {
        lines: 95,
        statements: 95,
        functions: 95,
        branches: 90,
      },
    },
  },
});
