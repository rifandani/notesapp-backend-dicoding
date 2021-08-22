class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(request, h) {
    // validate req.body
    this._validator.validateNotePayload(request.payload);

    const { title = 'untitled', body, tags } = request.payload;
    const { id: credentialId } = request.auth.credentials; // from jwt strategy

    // call add new note service
    const noteId = await this._service.addNote({
      title,
      body,
      tags,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId,
      },
    });
    response.code(201);
    return response;
  }

  async getNotesHandler(request) {
    const { id: credentialId } = request.auth.credentials; // from jwt strategy

    // call get notes service
    const notes = await this._service.getNotes(credentialId);

    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials; // from jwt strategy

    // await this._service.verifyNoteOwner(id, credentialId);
    await this._service.verifyNoteAccess(id, credentialId);

    // call get note by id service
    const note = await this._service.getNoteById(id);

    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  async putNoteByIdHandler(request) {
    // validate req.body
    this._validator.validateNotePayload(request.payload);

    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials; // from jwt strategy

    // await this._service.verifyNoteOwner(id, credentialId);
    await this._service.verifyNoteAccess(id, credentialId);

    // call edit note by id service
    await this._service.editNoteById(id, request.payload);

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deleteNoteByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials; // from jwt strategy

    await this._service.verifyNoteOwner(id, credentialId);

    // call delete note by id service
    await this._service.deleteNoteById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = NotesHandler;
