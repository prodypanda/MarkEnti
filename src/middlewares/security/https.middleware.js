/**
 * HTTPS middleware that redirects HTTP requests to HTTPS.
 *
 * Checks if the x-forwarded-proto header is https,
 * and redirects to https if not.
 */
const httpsMiddleware = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `http://${req.hostname}${req.url}`)
  }
  next()
}

module.exports = httpsMiddleware
