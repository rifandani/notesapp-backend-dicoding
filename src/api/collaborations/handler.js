/* eslint-disable operator-linebreak */

class CollaborationsHandler {
  constructor(collaborationsService, notesService, validator) {
    this._collaborationsService = collaborationsService;
    this._notesService = notesService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    // validate req.payload
    this._validator.validateCollaborationPayload(request.payload);

    const { noteId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials; // from jwt strategy

    // verify note owner
    this._notesService.verifyNoteOwner(noteId, credentialId);

    const collaborationId = await this._collaborationsService.addCollaboration(
      noteId,
      userId,
    );

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    // validate req.payload
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = request.payload;

    // verify note owner
    await this._notesService.verifyNoteOwner(noteId, credentialId);

    await this._collaborationsService.deleteCollaboration(noteId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
