const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'MarkEnti API',
      description:
        'API documentation for MarkEnti application, written in Node.js and Express.js',
      version: '1.0.0',
    },
    host: 'localhost:8080', // Replace with your actual host if different
    basePath: '/api',
    schemes: ['http'], // Or 'https' if applicable
    securityDefinitions: {
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header', // can be 'header', 'query' or 'cookie'
        name: 'token', // name of the header, query parameter or cookie
        description: 'API Key for authentication',
      },
    },
  },
  apis: ['../routes/auth.routes.js'], // Path to your route files
}

module.exports = swaggerOptions
