var express = require('express');
var router = express.Router();
const passport = require('passport');
const Collection = require('../models/collection');
const Figure = require('../models/figure');
const {
  ensureLoggedIn
} = require('connect-ensure-login');

//Show only collections with the same owner 
router.get('/', ensureLoggedIn('/login'), (req, res) => {

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

router.get('/:id', ensureLoggedIn('/login'), (req, res, next) => {
  Collection
    .findById(req.params.id)
    .populate('figures')
    .exec((err, collection) => {
      if (err) {
        return next(err);
      }
      console.log(`collectionId--------> ${collection}`);
      res.render('collections/showOne', {
        user: req.user,
        collection
      });
    });
});

//req.params.id --> request :id 
router.post('/:id', ensureLoggedIn('login'), (req, res, next) => {
  console.log(`LLEGA A POST COLLECTIONS/ID`);
  const updates = {
    name: req.body.collectionName,
    description: req.body.collectionDesc
  };
  console.log(`updates-->${updates}`);
  Collection.findByIdAndUpdate(req.params.id, updates, (err, collection) => {
    if (err) {
      return res.render('/', {
        collection,
        errors: collection.errors
      });
    }
    if (!collection) {
      return next(new Error('404'));
    }
    return res.redirect(`/collections/${collection._id}`);
  });
});


router.post('/:id/delete', ensureLoggedIn('login'), (req, res, next) => {
    Collection.findByIdAndRemove(req.params.id, (err, collection) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/collections');
    });
  }),

  router.get('/:id/figures/new', ensureLoggedIn('/login'), (req, res, next) => {
    Collection
      .findById(req.params.id)
      .populate('owner')
      .exec((err, collection) => {
        if (err || !collection) {
          return next(new Error('404'));
        }
        res.render('figures/new', {
          collection
        });
      });
  });

router.post('/:id/figures/new', ensureLoggedIn('/login'), (req, res, next) => {
  console.log(`ENTRANDOOOOOOOOOOOOOOOO AL POST`);
  const newFigure = new Figure({
    owner: req.user._id,
    name: req.body.name,
    available: req.body.available,
    designer: req.body.designer,
    number: req.body.number,
    collec: req.body.collec,
    adquisitionPrice: req.body.adquisitionPrice,
    personalNotes: req.body.personalNotes,
    image: req.body.image,
    favorite: req.body.favorite,
    sell: req.body.sell,
    // We're assuming a user is logged in here
    // If they aren't, this will throw an error
  });
  newFigure.save((err) => {
    if (err) {
      res.render('error');
    } else {
      /*       res.redirect(`/collections/${newCollection._id}`);
       */
      Collection
        .findById(req.params.id)
        .populate('figures')
        .exec((err, collection) => {
          if (err) {
            return next(err);
          } else {
            console.log(`Collection figures before ----------------> ${collection.figures}`);
            collection.figures.push(newFigure._id);
            /*             console.log("newFigure--->: " + JSON.stringify(newFigure, null, 4));
             */
            collection.save((err) => {
              if (err) {
                return next(err);
              } else {
                console.log(`Collection figures after ----------------> ${collection.figures}`);

                return res.redirect(`/collections/${req.params.id}`);
              }
            });
          }
        });
    }
  });
});


module.exports = router;

