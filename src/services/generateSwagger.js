const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
    title: 'MarkEnti API',
    description:
      'API documentation for MarkEnti application, written in Node.js and Express.js',
    version: '1.0.1'
  },
  host: 'localhost:8080', // Replace with your actual host if different
  swagger: '2.0',
  basePath: '',
  basedir: __dirname, // app absolute path
  schemes: ['http'], // Or 'https' if applicable
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'token', // name of the header, query parameter or cookie
      description: 'API Key for authentication'
    },
    JWT: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Basic apiKey authorization in the system'
    }
  }
}
const outputFile = './swagger-output.json' // Output file for the spec
const endpointsFiles = ['../routes/*.routes.js'] // Path to your route files
// const endpointsFiles = ['../app.js'] // Path to your route files

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('../server.js') // Assuming your main server file is server.js
})
