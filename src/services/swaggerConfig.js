const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  // swaggerDefinition: {
  definition: {
    // openapi: '3.0.0',
    swagger: '2.0',
    info: {
      title: 'MarkEnti API',
      description:
        'API documentation for MarkEnti application, written in Node.js and Express.js',
      version: '1.0.0'
    },
    host: 'localhost:8080', // Replace with your actual host if different
    schemes: ['http'], // Or 'https' if applicable
    servers: [
      {
        url: 'http://localhost:8080/api'
      }
    ]
  },
  apis: ['../routes/analytics.routes.js'] // Files containing API definitions
}

const specs = swaggerJsdoc(options)
