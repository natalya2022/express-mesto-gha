const OK = 200;
const CREATED = 201;
const BAD_REQUEST = { status: 400, message: 'Ошибка при введении данных' };
const NOT_FOUND = { status: 404, message: 'Указанный id не найден' };
const INTERNAL_SERVER_ERROR = { status: 500, message: 'Ошибка сервера' };

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
};
