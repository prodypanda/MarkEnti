const mongoose = require('mongoose')
const connectionString = process.env.MONGODB_URI

/**
 * Connects to MongoDB database using provided URI.
 * Handles connecting, setting strictQuery to false,
 * and logging success/errors.
 */
/**
 * Connects to a MongoDB database using Mongoose.
 * @returns {Promise<void>} A promise that resolves when the connection is established or rejects if an error occurs.
 */
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false)
    const conn = await mongoose.connect(connectionString, {
      dbName: 'pandavee3db',
      ssl: false, // Ensure this is true for encrypted connections
    })
    console.log(`Database Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error('Error connecting to database:', err.message)
    // process.exit(1)
    throw err
  }
}

// Export the connectDB function
module.exports = connectDB
