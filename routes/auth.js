var express = require('express');
var router = express.Router();
const passport = require('passport');
const {
  ensureLoggedIn,
  ensureLoggedOut
} = require('connect-ensure-login');

router.get('/login', ensureLoggedOut(), (req, res) => {
    /*     console.log('RRRRRRRRRRRRRRRRRRrequest:\n' + JSON.stringify(req.session));
     */
    res.render('auth/login', {
      errorMessage: req.flash('errorMsg')
    });
  })

  .post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true
  }));


  router.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read']
  }));
  
  router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/error',
    successRedirect: '/'
  }));

router.get('/signup', ensureLoggedOut(), (req, res, next) => {
    res.render('auth/signup', {
      errorMsg: req.flash('errorMsg')
    });
  })

  .post('/signup', ensureLoggedOut(),  passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: ('/signup'),
    failureFlash: true,
    successFlash: true
  }));

router.get('/logout', ensureLoggedIn(), (req, res, next) => {
  req.logout();
  res.redirect('/login');
});


module.exports = router;

