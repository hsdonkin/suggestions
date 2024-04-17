import { resolve } from 'path';
import { defineConfig } from 'vite';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.js'),
      name: 'suggestions',
      // the proper extensions will be added
      fileName: 'index',
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'suggestions.css';
          return assetInfo.name;
        },
      },
    },
    plugins: [
      nodeResolve({
        browser: true,
      }),
    ],
  },
});
