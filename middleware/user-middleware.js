const User = require('../models/user.js');
const util = require('util');

/**
 * Check if an user exists with email param.
 */
function checkEmailExists(req, res, next) {
console.log(`LLEGA checkEmailExists`);
console.log(`req.body-->${util.inspect(req.body,false,null)}`);
process.nextTick(() => {
  User.findOne({
    'email': req.body.email //update email
  }, (err, user) => {
    console.log(`user-->${util.inspect(user,false,null)}`);
    if (err) {
      return next(err);
    }
    if (user) {
      res.locals.emailExists = true;
    } else {
      res.locals.emailExists = false;
    }
    return next();
  });
});
}

module.exports = {
    checkEmailExists
};

