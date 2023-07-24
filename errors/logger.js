const fs = require('fs');

const logErrors = (user, params, body, err) => {
  const now = new Date();
  fs.appendFile('error.log', `${now.toUTCString()}
  ${JSON.stringify(user)}
  ${JSON.stringify(params)}
  ${JSON.stringify(body)}
  ${JSON.stringify(err)}\n\n`, () => {});
};

module.exports = logErrors;
