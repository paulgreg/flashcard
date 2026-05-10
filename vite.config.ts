import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import babel from '@rolldown/plugin-babel'

export default defineConfig(() => {
    return {
        build: {
            sourcemap: true,
        },
        base: './',
        plugins: [
            react(),
            babel({
                plugins: ['babel-plugin-react-compiler'],
            }),
            svgrPlugin(),
        ],
        test: {
            include: ['**/*.test.js'],
            globals: true,
        },
    }
})
