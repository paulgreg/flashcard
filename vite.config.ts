import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'

export default defineConfig(() => {
    return {
        build: {
            sourcemap: true,
        },
        base: './',
        plugins: [react(), svgrPlugin()],
        test: {
            include: ['**/*.test.js'],
            globals: true,
        },
    }
})
