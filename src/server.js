require('dotenv').config()

const http = require('http')
const app = require('./app')
const connectDB = require('./config/mongoose')

require('./middlewares/schedulers/discountScheduler')

const port = process.env.PORT || 8080

const server = http.createServer(app)

/**
 * Starts the server listening on the given port.
 * Logs a message indicating the server has started.
 * Establishes a database connection once the server has started.
 */
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  connectDB()
})

// process.on('SIGTERM', () => {
//   debug('SIGTERM signal received: closing HTTP server')
//   server.close(() => {
//     debug('HTTP server closed')
//   })
// })
