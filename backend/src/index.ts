import app from './app'

const PORT = 3001

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('🔥 Uncaught Exception:', error)
  process.exit(1)
})

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`)
  console.log('📝 Ready to handle workout requests!')
  console.log(`🔌 Connected to database: ${process.env.DATABASE_URL}`)
}) 