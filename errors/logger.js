const fs = require('fs');

const logErrors = (user, params, err) => {
  const now = new Date();
  fs.appendFile('error.log', `${now.toUTCString()}
  ${JSON.stringify(user)}
  ${JSON.stringify(params)}
  ${JSON.stringify(err)}\n\n`, () => {});
};

module.exports = logErrors;
