const jwt = require('jsonwebtoken');

const HttpError = require('../model/http-error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  let token;

  try {
    token = req.headers.authorization.split(' ')[1]; // 'Bearer TOKEN'

    if (!token) {
      throw new Error('Authentication failed, please try again.');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return next('Authentication failed, please try again.', 403);
  }
};
