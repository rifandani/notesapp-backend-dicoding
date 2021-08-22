const { NotePayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const NotesValidator = {
  validateNotePayload: (payload) => {
    const validationResult = NotePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = NotesValidator;
