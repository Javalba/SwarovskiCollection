var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    /*     console.log('RRRRRRRRRRRRRRRRRRrequest:\n' + JSON.stringify(req.session));
     */
    res.render('auth/login', {
      errorMessage: req.flash('errorMsg')
    });
  })

  .post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true
  }));

router.get('/signup', (req, res, next) => {
    res.render('auth/signup', {
      errorMsg: req.flash('errorMsg')
    });
  })

  .post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: ('/signup'),
    failureFlash: true,
    successFlash: true
  }));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});


module.exports = router;

