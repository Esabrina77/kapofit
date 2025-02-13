import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KaporalFit API',
      version: '1.0.0',
      description: 'API pour gérer les workouts et exercices',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // fichiers contenant les annotations
}

export const specs = swaggerJsdoc(options) 