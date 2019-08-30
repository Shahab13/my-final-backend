const { decodeToken } = require("../lib/token");

const isLoggedIn = (req, _res, next) => {
  if (!req.token) {
    const error = new Error(`You are not logged in.`);
    error.status = 401;
    return next(error);
  }

  try {
    decodeToken(req.token);
    next();
  } catch (e) {
    console.error(e);
    const error = new Error(`Username or Password is wrong.`);
    error.status = 401;
    next(error);
  }
};

const isSameUser = (req, _res, next) => {
  const id = req.params.userId;
  const payload = decodeToken(req.token);
  if (payload.id === id) return next();

  const error = new Error(`You are not admin so you can't have access.`);
  error.status = 401;
  next(error);
};

module.exports = { isLoggedIn, isSameUser };
