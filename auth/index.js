const jwt = require('jsonwebtoken');

const getUser = (token) => {
  if (token) {
    try {
      // return the user information from the token
      return jwt.verify(token, process.env.ACCESS_TOKEN);
    } catch (err) {
      console.log(err);
      // if there's a problem with the token, throw an error
      throw new Error('Session invalid');
    }
  }
};

const createAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, {
    expiresIn: '15m',
  });
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: '7d',
    }
  );
};

const sendRefreshToken = (res, token) => {
  res.cookie('qeso', token, {
    httpOnly: true,
    path: '/refresh_token',
  });
};

module.exports = {
  getUser,
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
};
