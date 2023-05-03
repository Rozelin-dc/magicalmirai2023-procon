import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/magicalmirai2023-procon/', // TODO: 応募前に消す(github pagesで配信する為だけに必要な設定なので)
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
  }
})
