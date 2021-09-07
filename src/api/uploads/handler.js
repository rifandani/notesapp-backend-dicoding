class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    const { data } = request.payload; // key = data

    // validate data headers, injected by hapi
    this._validator.validateImageHeaders(data.hapi.headers);

    // call storage service
    const filename = await this._service.writeFile(data, data.hapi); // like 1621706265086flower.jpg

    const response = h.response({
      status: 'success',
      data: {
        fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
        // fileLocation: filename, S3
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
