/* eslint-disable operator-linebreak */

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    // validate req.payload = { username, password }
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;

    // verify user creds
    const id = await this._usersService.verifyUserCredential(
      username,
      password,
    );

    // generate accessToken + refreshToken
    const accessToken = this._tokenManager.generateAccessToken({
      id,
    });
    const refreshToken = this._tokenManager.generateRefreshToken({
      id,
    });

    // add refreshToken to database
    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  // generate new accessToken using refreshToken
  async putAuthenticationHandler(request) {
    // validate req.payload = { refreshToken }
    this._validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;

    // verify refreshToken
    await this._authenticationsService.verifyRefreshToken(refreshToken);

    // generate new accessToken
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({
      id,
    });

    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  // user logout
  async deleteAuthenticationHandler(request) {
    // validate req.payload = { refreshToken }
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;

    // verify refreshToken, then delete it
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
