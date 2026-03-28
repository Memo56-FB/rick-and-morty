import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'app/components/**/*.tsx',
        'app/hooks/**/*.ts',
        'lib/**/*.ts',
      ],
      exclude: [
        'app/layout.tsx',
        'app/page.tsx',
        'app/providers/**',
        'lib/**/client.ts',
        'lib/store/hooks.ts',
        'lib/store/store.ts',
      ],
    },
  },
})
