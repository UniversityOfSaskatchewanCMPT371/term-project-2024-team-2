/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
// https://vitest.dev/config/
export default defineConfig({
  plugins: [react(),
    // Since browsers do not support Node's Core Modules,
    // packages that use them must be polyfilled to function in browser environments.
    nodePolyfills()],
  resolve: {
    // 'assert' and 'node:assert' points to the same module
    // However, the nodePolyfills plugin only polyfill the module entry point "node:assert"
    // https://www.npmjs.com/package/vite-plugin-node-polyfills
    // thus, we have to alias the assert module to node:assert
    // to ensure that we can use the assert whether we import it as 'assert' or 'node:assert'
    alias: {
      assert: "node:assert",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    deps: {
      inline: ['vitest-canvas-mock'],
    },
    setupFiles: ['./vitest.setup.ts'],
  }
})
