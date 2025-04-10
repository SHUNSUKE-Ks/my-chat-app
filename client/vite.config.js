import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // ✅ デプロイ先での相対パス読み込みに対応
  plugins: [react()],
})
