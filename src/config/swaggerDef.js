const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PandaVee3 API Documentation',
    version: '1.0.0',
    description:
      'This is the API documentation for the PandaVee3 e-commerce platform.'
  },
  components: {
    securitySchemas: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Development server',
      variables: {
        port: {
          default: '8080'
        }
      }
    }
  ]
}

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/models/*.js', './src/controllers/']
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec
