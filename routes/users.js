var express = require('express');
var router = express.Router();

const User = require('../models/user');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('main', {
    user: req.user
  });
});

router.get('/:email', function (req, res, next) {
  res.render('profile', {
    user: req.user
  });
});

/**
 * Edit profile
 */
router.post('/:email', function (req, res, next) {
console.log(`ROUTER USERS ENTER`);
  let email = req.params.email;
  let updates = {
    email: req.body.email,
    password: req.body.password,
    avatar: req.body.avatar,
    name: req.body.name,
    surname: req.body.surname,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    birthday: req.body.birthday,
  }
  console.log(`updates-->${JSON.stringify(updates)}`);

  /*   let updates = {
      email,
      password,
      avatar,
      name,
      surname,
      address,
      city,
      country,
      birthday
    } = req.body; */

  /**
   * findOneAndUpdate([conditions], [update], [options], [callback])
   */
  User.findOneAndUpdate(email, updates, (err, user) => {
    if (err) {
      next(err);
    } else {
           res.redirect(`/users/${email}`);
    }
  });
});

module.exports = router;

