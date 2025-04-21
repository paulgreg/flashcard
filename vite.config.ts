import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(() => {
    return {
        base: './',
        plugins: [
            react(),
            svgrPlugin(),
            VitePWA({ registerType: 'autoUpdate' }),
        ],
    }
})
