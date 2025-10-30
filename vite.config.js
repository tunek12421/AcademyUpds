import { defineConfig } from 'vite'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteStaticCopy } from 'vite-plugin-static-copy'


export default defineConfig({
  root: 'src',
  server: {
    historyApiFallback: {
      rewrites: [
        // Mantener rutas de assets como están
        { from: /^\/assets\//, to: function(context) { return context.parsedUrl.pathname } },
        // Todo lo demás va a index.html para SPA
        { from: /^\/curso/, to: '/index.html' },
        { from: /^\/cursos/, to: '/index.html' },
        { from: /^\/mikrotik/, to: '/index.html' },
        { from: /^\/home/, to: '/index.html' },
        { from: /^\/ciencias-salud/, to: '/index.html' },
        { from: /^\/ingenieria/, to: '/index.html' },
        { from: /^\/ciencias-empresariales/, to: '/index.html' },
        { from: /^\/ciencias-juridicas/, to: '/index.html' },
        { from: /./, to: '/index.html' }
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
        index: resolve(__dirname, 'src/index.html'),  // Agregar SPA
        home: resolve(__dirname, 'src/assets/pages/home.html'),
        mikrotik: resolve(__dirname, 'src/assets/pages/mikrotik.html'),
        curso: resolve(__dirname, 'src/assets/pages/curso.html'),
        cursos: resolve(__dirname, 'src/assets/pages/cursos.html'),
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
          src: 'assets/images/cursos/*',
          dest: 'assets/images/cursos'
        },
        {
          src: 'assets/images/academias/*',
          dest: 'assets/images/academias'
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