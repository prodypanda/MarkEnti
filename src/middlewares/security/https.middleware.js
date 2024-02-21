const httpsMiddleware = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `http://${req.hostname}${req.url}`);
  }
  next();
};

module.exports = httpsMiddleware;
