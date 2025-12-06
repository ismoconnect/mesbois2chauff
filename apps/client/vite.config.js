import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [
            react(),
            svgr()
        ],
        server: {
            port: 3000,
            open: true,
        },
        build: {
            outDir: 'dist',
            sourcemap: true,
        },
        esbuild: {
            loader: "jsx",
            include: /src\/.*\.jsx?$/,
            exclude: [],
        },
        optimizeDeps: {
            esbuildOptions: {
                loader: {
                    '.js': 'jsx',
                },
            },
        },
        define: {
            'process.env': env
        },
        resolve: {
            alias: {
                src: "/src",
            },
        },
    };
});
