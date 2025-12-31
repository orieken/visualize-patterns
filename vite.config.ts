import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const isTest = process.env.NODE_ENV === 'test' || mode === 'test' || !!process.env.VITEST;
  
  return {
    plugins: [vue()],
    resolve: {
        alias: isTest ? [
            { 
              find: fileURLToPath(new URL('./src/components/CodeEditor.vue', import.meta.url)), 
              replacement: fileURLToPath(new URL('./src/mocks/CodeEditorMock.vue', import.meta.url)) 
            },
            // Keep worker aliases just in case
            { find: /.*\/editor\.worker\?worker/, replacement: fileURLToPath(new URL('./src/mocks/workerMock.ts', import.meta.url)) },
            { find: /.*\/json\.worker\?worker/, replacement: fileURLToPath(new URL('./src/mocks/workerMock.ts', import.meta.url)) },
            { find: /.*\/css\.worker\?worker/, replacement: fileURLToPath(new URL('./src/mocks/workerMock.ts', import.meta.url)) },
            { find: /.*\/html\.worker\?worker/, replacement: fileURLToPath(new URL('./src/mocks/workerMock.ts', import.meta.url)) },
            { find: /.*\/ts\.worker\?worker/, replacement: fileURLToPath(new URL('./src/mocks/workerMock.ts', import.meta.url)) },
        ] : undefined
    },
    test: {
      environment: 'jsdom',
      globals: true
    }
  };
});
