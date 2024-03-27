/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
// https://vitest.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  test: {
    globals: true,
    environment: "jsdom",
    deps: {
      inline: ['vitest-canvas-mock'],
    },
    setupFiles: ['./vitest.setup.ts'],
  }
})
