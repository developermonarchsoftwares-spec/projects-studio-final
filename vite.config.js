import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function contactApiDevServer() {
  return {
    name: 'contact-api-dev-server',
    apply: 'serve',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, '')
      process.env.GMAIL_SMTP_PASS = process.env.GMAIL_SMTP_PASS || env.GMAIL_SMTP_PASS
    },
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res, next) => {
        if (req.method !== 'POST') return next()

        try {
          const chunks = []
          for await (const chunk of req) {
            chunks.push(chunk)
          }

          const rawBody = Buffer.concat(chunks).toString('utf8')
          req.body = rawBody ? JSON.parse(rawBody) : {}

          const { default: handler } = await import('./api/contact.js')
          await handler(req, res)
        } catch (error) {
          console.error('Local contact API failed', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Email could not be sent' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), contactApiDevServer()],
  base: '/',
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js core — large, shared across all 3-D scenes
          if (id.includes('node_modules/three/')) return 'three'
          // React-Three-Fiber / Drei — loaded only when a 3-D scene mounts
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) return 'fiber'
          // Framer-motion — animation library
          if (id.includes('framer-motion')) return 'framer'
          // tsParticles engine & React integrations
          if (id.includes('@tsparticles')) return 'tsparticles'
          // React core — always needed
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('react-router-dom')) return 'vendor'
        },
      },
    },
  },
})
