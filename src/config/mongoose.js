const mongoose = require('mongoose')
const connectionString = process.env.MONGODB_URI

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false)
    const conn = await mongoose.connect(connectionString, {
      dbName: 'pandavee3db',

      ssl: false, // Ensure this is true for encrypted connections
    })
    console.log(`Database Connected: ${conn.connection.host}`)
  } catch (err) {
    console.log('error')
    console.error(err.message)
    process.exit(1)
  }
}

module.exports = connectDB
