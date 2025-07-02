import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({ registerType: 'autoUpdate' })],
  resolve: {
    alias: {
      "@config": path.resolve(__dirname, './src/config'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@images': path.resolve(__dirname, './src/images'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@utils': path.resolve(__dirname, './src/utils'),
      "@graphql_generated/*": path.resolve('./src/components/operations/__generated__/*'),
      "@i18n": path.resolve(__dirname, './src/i18n'),
      "@types": path.resolve(__dirname, './src/types')
    }
  }
})
