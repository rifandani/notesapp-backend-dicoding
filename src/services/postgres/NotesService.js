/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */

const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToModel } = require('../../utils');

class NotesService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  // memverifikasi hak akses pengguna (userId) terhadap catatan (id), baik sbg owner / collaboration
  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationService.verifyCollaborator(noteId, userId);
      } catch {
        throw error;
      }
    }
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addNote({ title, body, tags, owner }) {
    const id = nanoid();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // get only notes by specified owner
  async getNotes(owner) {
    // menggunakan LEFT JOIN karena tabel notes berada di posisi paling kiri (dipanggil pertama kali)
    const query = {
      text: `SELECT notes.* FROM notes
    LEFT JOIN collaborations ON collaborations.note_id = notes.id
    WHERE notes.owner = $1 OR collaborations.user_id = $1
    GROUP BY notes.id`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    const mappedNotes = result.rows.map(mapDBToModel);

    return mappedNotes;
  }

  async getNoteById(id) {
    const query = {
      text: `SELECT notes.*, users.username
    FROM notes
    LEFT JOIN users ON users.id = notes.owner
    WHERE notes.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    const mappedNotes = result.rows.map(mapDBToModel)[0];

    return mappedNotes;
  }

  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [title, body, tags, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = NotesService;
