const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const loggerMiddleware = require('./middleware/logger.middleware')
const rateLimitMiddleware = require('./middleware/rateLimit.middleware')
const helmet = require('helmet')
const sanitizeMiddleware = require('./middleware/sanitize.middleware')
const { csrfProtection } = require('./middleware/csrf.middleware')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')
const authRoutes = require('./routes/auth.routes')
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
const cookieParser = require('cookie-parser')
const guestSessionMiddleware = require('./middleware/guestSession.middleware')
const guestCartRoutes = require('./routes/guestCart.routes')
const app = express()

// app.use(loggerMiddleware)

app.use(rateLimitMiddleware.apiLimiter)

app.use(bodyParser.json())
app.use(cookieParser())
app.use(guestSessionMiddleware)
app.use(passport.initialize())
require('./config/passport')

app.get('/ping', (req, res) => {
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

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // '*' for allowing any origin
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});


if (process.env.SERVE_SWAGGER_DOCS === 'true') {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true })
  )
  app.get('/swagger-output.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerDocument)
  })
}

app.use('/api/auth', authRoutes)
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
