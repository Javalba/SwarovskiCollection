var express = require('express');
var router = express.Router();
const passport = require('passport');
const Collection = require('../models/collection');
const {
  ensureLoggedIn
} = require('connect-ensure-login');

//Show only collections with the same owner 
router.get('/', ensureLoggedIn('/login'), (req, res) => {
/*   Collection
    .find({})
    .populate('owner')
    .exec((err, collections) => {
      res.render('collections/show', {
        errorMessage: req.flash('errorMsg'),
        user: req.user,
        collections,
      });
    }); */
    
Collection.find({
    owner: {
      $in: req.user
    }
  })
  .exec((err, collections) => {
    console.log(`collections -->${collections}`);
    res.render('collections/show', {
      errorMessage: req.flash('errorMsg'),
      user: req.user,
      collections,
    });
  });
});


router.get('/new', ensureLoggedIn('/login'), (req, res, next) => {
  res.render('collections/new', {
    user: req.user
  });
});

router.post('/new', ensureLoggedIn('/login'), (req, res, next) => {
  const newCollection = new Collection({
    name: req.body.name,
    description: req.body.description,
    // We're assuming a user is logged in here
    // If they aren't, this will throw an error
    owner: req.user._id
  });
  console.log("newCollection--->: " + JSON.stringify(newCollection, null, 4));

  newCollection.save((err) => {
    if (err) {
      res.render('collections/new');
    } else {
      /*       res.redirect(`/collections/${newCollection._id}`);
       */
      res.redirect(`/collections`);
    }
  });
});


module.exports = router;

