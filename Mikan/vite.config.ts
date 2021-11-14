import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), WindiCSS()],
  build: {
    minify: false,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/index.html'),
        popup: resolve(__dirname, 'src/popup/index.html'),
      },
    },
  },
});
