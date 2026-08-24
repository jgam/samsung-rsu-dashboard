import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: { provider: 'v8', include: ['src/lib/**/*.ts'], thresholds: { lines: 91, functions: 91, branches: 91, statements: 91 } },
  },
})
