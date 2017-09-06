const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const User = require('./models/user');
const moment = require('moment');
const flash = require('connect-flash');
const GoogleStrategy = require("passport-google-oauth")
  .OAuth2Strategy;
const util = require('util');



//Authentication & Authorization modules
const LocalStrategy = require('passport-local')
  .Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Mongoose connection configuration
mongoose.connect('mongodb://localhost/swarovski');


//routes path's
const index = require('./routes/index');
const auth = require('./routes/auth');
const users = require('./routes/users');
const collections = require('./routes/collections');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//layouts
app.set('layout', 'layouts/index');
app.use(expressLayouts);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  outputStyle: 'compressed',
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

//SESSION 
/* app.use(session({
  secret: 'our-passport-local-strategy-app',
  resave: true,
  saveUninitialized: true
})); */

app.use(session({
  secret: 'swarovskiproject1',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 2000000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 6 * 60 * 60 // (1/4) day
  })
}));

//flash
app.use(flash());
app.locals.moment = moment;

/*SESSION */
passport.serializeUser((user, cb) => {
  //console.log('serialize user:', user);
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  //console.log('desserialize id:', id);

  User.findOne({
    '_id': id
  }, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});


// Signing Up

passport.use(new GoogleStrategy({
  clientID: '60359403657-2kb369umburkbc39rl0stodcc4vvuj6q.apps.googleusercontent.com',
  clientSecret: 'wPvEsVlevR0t-mB5aV-AZ5Gn',
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  User.findOne({
    googleID: profile.id
  }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      console.log(`USER FOUND!!!!!!`);
      // if a user is found, log him in
      return done(null, user);
    }
    console.log(`FIRST USER CREATE!!!!!!`);

    // if the user isnt in our database, create a new user
    const newUser = new User({
      googleID: profile.id,
      name: profile.name.givenName, //    console.log(`name: ${profile.name.givenName}`);       
      surname: profile.name.familyName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value
    });

    console.log(`user-->${newUser}`);

    newUser.save((err) => {
      if (err)
        throw err;
      return done(null, newUser);
    });
  });

}));


/**
 * LocalStrategy expects to find credentials in parameters named 'username' and 'password'.
 * 
 */
passport.use('local-signup', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email' // change the defaults username parameter
  },
  (req, email, password, next) => {
    // To avoid race conditions
    // Make code async, User.findOne won't fire until we have all our data back
    process.nextTick(() => {
      console.log(`LocalStrategy. FIRST`);
      User.findOne({
        'email': email
      }, (err, user) => {
        if (err) {
          let key = 'errorMsg',
            msg = 'Something wrong, try again!';
          return next(err, req.flash(key, msg));
        }
        if (user) {
          let key = 'errorMsg',
            msg = `${email} is already taken. Plase, try another one`;
          return next(null, false, req.flash(key, msg));
        } else {
          // Destructure the body
          /*           const {
                      email,
                      password,
                      name,
                      surname,
                      address,
                      city,
                      country,
                      birthday
                    } = req.body; */
                    console.log(`NO ERRORS`);
          const hashPass = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
          console.log(`HASPASS.`);
          const newUser = new User({
            email: req.body.email,
            password: hashPass,
            name: req.body.name,
            surname: req.body.surname,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            birthday: req.body.birthday
          });
      

          if(req.file){
            newUser.avatar = `/uploads/${req.file.filename}`;
          }
          console.log(`NEW USER ${newUser}`);
          console.log(`NEW USER/${util.inspect(newUser,false,null)}`);
          

          newUser.save((err) => {
            if (err) {
              next(err);
            }
            let key = 'message',
              msg = `Thanks! ${newUser.email} has successfully signed up!`;
            return next(null, newUser, req.flash(key, msg));
          });
        }
      });
    });
  }));

// Login
passport.use('local-login', new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email'
}, (req, email, password, next) => {
  console.log(`LOCAL-LOGIN`);
  User.findOne({
    email
  }, (err, user) => {
    if (err) {
      let key = 'errorMsg',
        msg = 'Error, try again';
      return next(err, req.flash(key, msg));
    }
    if (!user) {
      let key = 'errorMsg',
        msg = `${email} doesn't exist, sign up or try again`;
      return next(null, false, req.flash(key, msg));
    }
    if (!bcrypt.compareSync(password, user.password)) {
      let key = 'errorMsg',
        msg = `Incorrect password, try again`;
      return next(null, false, req.flash(key, msg));
    }
    return next(null, user);
  });
}));


app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  if (typeof (req.user) !== 'undefined') {
    res.locals.userSignedIn = true;
  } else {
    res.locals.userSignedIn = false;
  }
  next();
});




//use routes
app.use('/', index);
app.use('/', auth);
app.use('/users', users);
app.use('/collections', collections);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

