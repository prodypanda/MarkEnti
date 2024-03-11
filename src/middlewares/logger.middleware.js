// Logger Middleware
/**
 * Masks sensitive data in the given object by replacing
 * password with masked value if present
 *
 * @param {Object} body - The request body object
 * @returns {Object} - The body object with masked password if present
 */
const maskSensitiveData = (body) => {
  if (body?.password) {
    return { ...body, password: '*****' }
  }
  return body
}
/**
 * Logger middleware for logging request info to console
 *
 * Logs request method, URL, headers, query params etc.
 * Also logs response statusCode and body
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const loggerMiddleware = (req, res, next) => {
  if (process.env.LOG_CONSOLE === 'true') {
    console.log(`request method and URL : ${req.method} ${req.originalUrl}`) // Log the request method and URL
    console.log(`request query : ${JSON.stringify(req.query)}`) // Log the request query
    console.log(`request params : ${JSON.stringify(req.params)}`) // Log the request params
    console.log(`request headers : ${JSON.stringify(req.headers)}`) // Log the request headers
    console.log(`request ip : ${req.ip}`) // Log the request ip
    console.log(`request hostname : ${req.hostname}`) // Log the request hostname
    console.log(`request protocol : ${req.protocol}`) // Log the request protocol
    console.log(`request secure : ${req.secure}`) // Log the request secure
    console.log(`request originalUrl : ${req.originalUrl}`) // Log the request originalUrl
    console.log(`request path : ${req.path}`) // Log the request path

    console.log(
      '--------------------------------------------------------------------------------'
    )
    console.log(`${res.statusCode} `)
    console.log(`${res.JSON} `)
    console.log(
      '***************************************************************************'
    )
  }
  next() // Continue to next middleware
}

module.exports = loggerMiddleware
