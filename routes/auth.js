var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMsg: req.flash('errorMsg')
  });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: ('/signup'),
  failureFlash: true,
  successFlash: true
}));

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

module.exports = router;

