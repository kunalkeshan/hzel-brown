import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom environment for DOM testing
    environment: 'jsdom',

    // Setup files to run before each test
    setupFiles: ['./test/setup.ts'],

    // Global test utilities
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'config/**',
        'types/**',
        'sanity/**',
        '.next/**',
        'e2e/**',
        '**/index.ts', // Re-exports only
      ],
      // Thresholds
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },

    // Include test files
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    // Exclude files
    exclude: [
      'node_modules',
      '.next',
      'e2e',
      'dist',
      'build',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/stores': path.resolve(__dirname, './stores'),
      '@/types': path.resolve(__dirname, './types'),
      '@/config': path.resolve(__dirname, './config'),
      '@/constants': path.resolve(__dirname, './constants'),
      '@/sanity': path.resolve(__dirname, './sanity'),
    },
  },
})
