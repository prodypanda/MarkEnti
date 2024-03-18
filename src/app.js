const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const helmet = require('helmet')

// middlewares
const loggerMiddleware = require('./middlewares/logger.middleware')
const rateLimitMiddleware = require('./middlewares/security/rateLimit.middleware')
const sanitizeMiddleware = require('./middlewares/sanitize.middleware')
const { csrfProtection } = require('./middlewares/security/csrf.middleware')
const guestSessionMiddleware = require('./middlewares/guestSession.middleware')

// routes
const authRoutes = require('./routes/auth.routes')
const roleRoutes = require('./routes/role.routes')
const permissionRoutes = require('./routes/permission.routes')
const categoryRoutes = require('./routes/category.routes')
const productRoutes = require('./routes/product.routes')
const orderRoutes = require('./routes/order.routes')
const paymentRoutes = require('./routes/payment.routes')
const analyticsRoutes = require('./routes/analytics.routes')
const designRoutes = require('./routes/design.routes')
const userRoutes = require('./routes/user.routes')
const shippingRoutes = require('./routes/shipping.routes')
const promoCodeRoutes = require('./routes/promoCode.routes')
const inventoryRoutes = require('./routes/inventory.routes')
const discountRoutes = require('./routes/discount.routes')
const salesReportsRoutes = require('./routes/salesReports.routes')
const cmsRoutes = require('./routes/cms.routes')
const menuRoutes = require('./routes/menu.routes')
const cartRoutes = require('./routes/cart.routes')
const guestCartRoutes = require('./routes/guestCart.routes')
const userTRoutes = require('./routes/users')

// const swaggerUi = require('swagger-ui-express')

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    // swagger: '2.0',
    // openapi: '3.0.0',
    openapi: '3.1.0',
    // restapi: '3.0.0',
    info: {
      title: 'MarkEnti API',
      description:
        'This interactive documentation provides a comprehensive overview of the MarkEnti API, built with Node.js and Express.js. <br>Explore the available endpoints, their parameters, request and response structures, and authentication mechanisms. <br>You can also test API calls directly from this interface.' +
        "For deepper information about the MarkEnti API platform, its features,  architecture, and its usage, please visit [the project's GitHub repository WIKIs [here](https://github.com/prodypanda/MarkEnti/wiki).",

      version: '1.0.0',
      license: {
        name: 'MarkEnti License',
        url: 'https://github.com/prodypanda/MarkEnti?tab=License-1-ov-file',
      },
      contact: {
        name: 'ProdyPanda',
        url: 'https://prodypanda.com',
        email: 'admin@prodypanda.com',
      },
    },

    schemes: ['http'], // Or 'https' if applicable
    // basedir: __dirname, // app absolute path

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
  apis: ['./src/routes/*.routes.js', './src/models/*.model.js'],
}

// const specs = require('./services/swaggerConfig')

// const swaggerDocument = require('./services/swagger-output.json')
const swaggerSpecs = swaggerJsdoc(options)
const app = express()

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: false,
    // customCss: '.swagger-ui .topbar { display: none }',
    // customCssUrl: '/custom.css',
    // customJs: '/custom.js',
    swaggerOptions: {
      // layout: 'BaseLayout',
      deepLinkings: true,
      deepLinkPaths: true,
      displayOperationIds: true,

      tagsSorter: 'alpha',
      // defaultModelsExpandDepth: 0,
      // defaultModelExpandDepth: -1,
      docExpansion: 'none',
    },
  })
)
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// app.use(loggerMiddleware)

app.use(rateLimitMiddleware.apiLimiter)

app.use(bodyParser.json())
app.use(cookieParser())
app.use(guestSessionMiddleware)
app.use(passport.initialize())
// Custom error handler for unauthorized requests

require('./config/passport')

/**
 * Responds to a GET request to /ping with a 200 status code and 'pong' message.
 * Can be used as a health check endpoint.
 */
app.get('/api/ping', (req, res) => {
  res.status(200).send('pong')
})

app.use(helmet())
app.use(sanitizeMiddleware())

// app.use(csrfProtection)

// app.use((req, res, next) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken(), {
//     httpOnly: false,
//     sameSite: 'none',
//   })
//   next()
// })

app.use((req, res, next) => {
  //access control allow origin from env variable or '*' for all origins.
  res.header('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  return next()
})

app.use('/api/v1', userTRoutes) // Mount routes with a base path

app.use('/api/auth', authRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/permissions', permissionRoutes)

app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/design', designRoutes)
app.use('/api/users', userRoutes)
app.use('/api/promocodes', promoCodeRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/shipping', shippingRoutes)
app.use('/api/discounts', discountRoutes)
app.use('/api/sales-reports', salesReportsRoutes)
app.use('/api/cms', cmsRoutes)
app.use('/api/menus', menuRoutes)
app.use('/api/carts/guest', guestCartRoutes)

module.exports = app
