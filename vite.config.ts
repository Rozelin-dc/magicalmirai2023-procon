/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // github pagesでの配信用設定 base: '/magicalmirai2023-procon/',
  build: {
    outDir: './docs'
  },
  server: {
    port: 2323
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/_variables.scss";`
      }
    }
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'jsdom'
  }
})
