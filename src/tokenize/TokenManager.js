/* eslint-disable implicit-arrow-linebreak */

const Jwt = require('@hapi/jwt');

const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      // decode token, then verify token
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      return artifacts.decoded.payload;
    } catch (err) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
