var express = require('express');
var router = express.Router();
const util = require('util');
const {
  ensureLoggedIn
} = require('connect-ensure-login');
const multer = require('multer');
const upload = multer({
  dest: './public/uploads/profiles/'

});
const User = require('../models/user');


/* GET users listing. */
router.get('/', ensureLoggedIn('/login'), function (req, res, next) {
  res.send('main', {
    user: req.user
  });
});

router.get('/:email',ensureLoggedIn('/login'), function (req, res, next) {
  res.render('profile', {
    user: req.user
  });
});

/**
 * Edit profile
 */
router.post('/:email', upload.single('avatar'), ensureLoggedIn('/login'),function (req, res, next) {
  console.log(`REQ-:::::::::->${util.inspect(req.body)}`);
let emailReq = req.params.email;
  let updates = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    surname: req.body.surname,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    birthday: req.body.birthday,
  }
  if(req.file){
    updates.avatar = `/uploads/profiles/${req.file.filename}`; 
  }
  console.log(`updates-->${JSON.stringify(updates)}`);

  /**
   * findOneAndUpdate([conditions], [update], [options], [callback])
   */
  User.findOneAndUpdate({email:emailReq}, updates, (err, user) => {
    if (err) {
      next(err);
    } else {
      console.log(`user-->${util.inspect(user)}`);
      res.redirect(`/users/${emailReq}`);
    }
  });
});

module.exports = router;

