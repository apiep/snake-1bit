import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: { chunkSizeWarningLimit: 2000 },
  // Deploy (Handlify) menyajikan hasil build lewat `vite preview` di balik hostname *.handlify.qiscus.io.
  preview: { allowedHosts: true }
})
