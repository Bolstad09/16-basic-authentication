'use strict';

import User from './model.js';

export default (req, res, next) => {
  let authenticate = (auth) => {

    User.authenticate(auth)

      .then(user => {
        if (!user) {
          getAuth();
        }
        else {
          req.token = user.generateToken();
          next();
        }
      })
      .catch(next);
  };

  let getAuth = () => {

    next({
      status: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid User ID/Password',
    });
  };

  try {
    let auth = {};
    let authHeader = req.headers.authorization;

    if (!authHeader) {
      return getAuth();
    }

    if (authHeader.match(/basic/i)) {
      let base64Header = authHeader.replace(/Basic\s+/i, '');
      let base64Buffer = Buffer.from(base64Header, 'base64');
      let bufferString = base64Buffer.toString();
      let [username, password] = bufferString.split(':');

      auth = { username, password };

      authenticate(auth);
    }
  }
  catch (e) {
    next(e);
  }
};