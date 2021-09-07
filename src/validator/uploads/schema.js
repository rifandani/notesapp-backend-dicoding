const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/webp',
    )
    .required(),
}).unknown(); // membuat objek bersifat tidak diketahui
// Artinya, objek boleh memiliki properti apa pun,
// karena memang kita tidak tahu objek dapat memiliki properti apa saja
// selama terdapat properti content-type

module.exports = {
  ImageHeadersSchema,
};
