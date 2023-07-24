const fs = require('fs');

const logErrors = (user, params, body, err) => {
  const now = new Date();
  fs.appendFile('error.log', `${now.toUTCString()}
  'currentuser: '${JSON.stringify(user)}
  'req.params: '${JSON.stringify(params)}
  'req.body: '${JSON.stringify(body)}
  'err: '${JSON.stringify(err)}\n\n`, () => {});
};

module.exports = logErrors;
