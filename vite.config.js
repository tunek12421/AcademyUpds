import { defineConfig } from 'vite'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteStaticCopy } from 'vite-plugin-static-copy'


export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
        unused: true
      },
      mangle: {
        toplevel: true
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        mikrotik: resolve(__dirname, 'src/mikrotik.html'),
        curso: resolve(__dirname, 'src/curso.html'),
        header: resolve(__dirname, 'src/assets/sections/header.html'),
        footer: resolve(__dirname, 'src/assets/sections/footer.html'),
      }
    }
  },
  plugins: [
    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
      }
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'assets/images/instructor/*',
          dest: 'assets/images/instructor'
        },
      ]
    })
  ]
})