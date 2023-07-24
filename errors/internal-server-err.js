const { INTERNAL_SERVER_ERROR } = require('./responses');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;
