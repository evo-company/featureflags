import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import $monacoEditorPlugin from 'vite-plugin-monaco-editor'
const monacoEditorPlugin = $monacoEditorPlugin.default ?? $monacoEditorPlugin

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
    proxy: {
      '/graphql': 'http://localhost:8080'
    },
  },
  plugins: [
    react(),
     monacoEditorPlugin({
        languageWorkers: ['editorWorkerService', 'json'],
        customWorkers: [
          {
            label: 'graphql',
            entry: 'monaco-graphql/esm/graphql.worker.js'
          }
        ]
      }),
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress "Module level directives cause errors when bundled" warnings
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
  resolve: {
    alias: [
      { find: /^~/, replacement: '' }
    ],
  }
})
