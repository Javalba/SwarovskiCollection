var express = require('express');
var router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
var flash = require('connect-flash');


router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
  })

  .post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true,
    successFlash: true,

  }));

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});



module.exports = router;

/* const express = require('express');
const router = express.Router();
const passport = require("passport");
//We need to make sure a few routes in our authentication routes are locked down with authorization

const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

//login
router
    .get('/login', ensureLoggedOut(), (req, res,next) => {
        res.render('authentication/login');
    })

    .post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));


//signup
router
    .get('/signup', ensureLoggedOut(), (req, res, next) => {
        res.render('authentication/signup');
    })

    .post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup'
    }));

//logout
router.post('/logout', ensureLoggedIn(), (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router; */

