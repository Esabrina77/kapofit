import { server } from './app'
import { config } from './config'

const PORT = config.port || 3002

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('🔥 Uncaught Exception:', error)
  process.exit(1)
})

// Démarrage du serveur (une seule fois)
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`)
  console.log('📝 Ready to handle workout requests!')
  console.log('🔌 Socket.IO server is ready')
}) 