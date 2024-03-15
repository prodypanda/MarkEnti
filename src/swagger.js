const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  swaggerDefinition: {
    // swagger: '2.0',
    // openapi: '3.0.0',
    info: {
      title: 'MarkEnti API',
      description:
        'API documentation for MarkEnti application, written in Node.js and Express.js',
      version: '1.0.0',
    },
    restapi: '3.0.0',
    schemes: ['http'], // Or 'https' if applicable
    basePath: '/api',
    // basedir: __dirname, // app absolute path
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
    securityDefinitions: {
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header', // can be 'header', 'query' or 'cookie'
        name: 'token', // name of the header, query parameter or cookie
        description: 'API Key for authentication',
      },
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'Basic apiKey authorization in the system',
      },
    },
  },
  apis: ['./routes/*.routes.js'],
}

const specs = swaggerJsdoc(options)

module.exports = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  )
}
