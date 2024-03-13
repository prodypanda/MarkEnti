const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
    title: 'MarkEnti API',
    description:
      'API documentation for MarkEnti application, written in Node.js and Express.js',
    version: '1.0.0',
  },
  host: 'localhost:8080', // Replace with your actual host if different
  basePath: '',
  schemes: ['http'], // Or 'https' if applicable
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'token', // name of the header, query parameter or cookie
      description: 'API Key for authentication',
    },
  },
}
const outputFile = './swagger-output.json' // Output file for the spec
// const endpointsFiles = ['../routes/*.js'] // Path to your route files
const endpointsFiles = ['../app.js'] // Path to your route files

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('../server.js') // Assuming your main server file is server.js
})
