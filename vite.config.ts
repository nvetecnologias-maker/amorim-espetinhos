import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `SINGLEFILE=1 npm run build` gera um único index.html (útil para prévias).
export default defineConfig({
  plugins: [react(), ...(process.env.SINGLEFILE ? [viteSingleFile()] : [])],
  build: { chunkSizeWarningLimit: 700 },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
