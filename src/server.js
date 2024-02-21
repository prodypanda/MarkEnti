require('dotenv').config()

const http = require('http')
const app = require('./app')
const connectDB = require('./config/mongoose')

require('./schedulers/discountScheduler')

const port = process.env.PORT || 8080

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  connectDB()
})
