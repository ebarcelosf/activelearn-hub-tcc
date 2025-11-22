import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Não usar setupFiles para evitar problemas de importação
    setupFiles: [],
  },
});