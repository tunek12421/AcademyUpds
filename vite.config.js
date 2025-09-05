import { defineConfig } from 'vite'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteStaticCopy } from 'vite-plugin-static-copy'


export default defineConfig({
  root: 'src',
  server: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/curso/, to: '/spa.html' },
        { from: /^\/cursos/, to: '/spa.html' },
        { from: /^\/mikrotik/, to: '/spa.html' },
        { from: /./, to: '/spa.html' }
      ]
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,  // Mantener console.logs para debugging SPA
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
        spa: resolve(__dirname, 'src/spa.html'),  // Agregar SPA
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
        {
          src: 'assets/images/logos/UPDS2.png',
          dest: 'assets/images/logos'
        },
        {
          src: 'assets/images/logos/UPDS5.png',
          dest: 'assets/images/logos'
        },
        {
          src: '../.htaccess',
          dest: '.'
        },
        {
          src: '../_redirects',
          dest: '.'
        },
        {
          src: '../vercel.json',
          dest: '.'
        }
      ]
    })
  ]
})