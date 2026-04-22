import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig( {
  test: {
    globals: true,
    environment: 'node',
    include: [ 'src/**/*.spec.ts', 'src/**/*.test.ts' ],
    exclude: [ 'node_modules', 'dist', '.idea', '.git', '.cache' ],
    coverage: {
      provider: 'v8',
      reporter: [ 'text', 'json', 'html' ],
      exclude: [
        'node_modules/',
        'src/**/*.module.ts',
        'src/**/index.ts',
        'src/**/*.dto.ts',
      ],
    },
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': path.resolve( __dirname, './src' ),
    },
  },
} );
