import { defineConfig } from 'vite'
import {resolve} from 'path'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    lib:{
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es']
    },
    rollupOptions: {
      external(src,importer,isResolved) {
        if(src.includes('preact-remark')) return false
        return true
      }
    }
  }
})
