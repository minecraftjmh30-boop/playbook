import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

const root = process.cwd();

export default defineConfig({
    root,
    plugins: [vue()],
    publicDir: 'public',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: resolve(root, 'index.html')
        }
    }
});