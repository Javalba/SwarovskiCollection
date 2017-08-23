var express = require('express');
var router = express.Router();
const Collection = require('../models/collection');
const Figure = require('../models/figure');
const {
  ensureLoggedIn
} = require('connect-ensure-login');
var multer  = require('multer');
// Route to upload from project base path
const upload = multer({
  dest: './public/uploads/'
});

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
  //console.log("newCollection--->: " + JSON.stringify(newCollection, null, 4));

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
      /**
       * ToDo: Delete vinculated figures.
       */
      return res.redirect('/collections');
    });
  }),

  /**
   * 
   * FIGURES
   *
   * */
  router.get('/:id/figures/new', ensureLoggedIn('/login'), (req, res, next) => {
    Collection
      .findById(req.params.id)
      .populate('owner')
      .exec((err, collection) => {
        if (err || !collection) {
          return next(new Error('404'));
        }
        res.render('figures/new', {
          user: req.user,
          collection
        });
      });
  });

//upload.single is a Multer middleware. File upload will be handled by Multer. 
router.post('/:id/figures/new', upload.single('image'), ensureLoggedIn('/login'), (req, res, next) => {
  const newFigure = new Figure({
    owner: req.user._id,
    name: req.body.name,
    available: req.body.available,
    designer: req.body.designer,
    number: req.body.number,
    collec: req.body.collec,
    adquisitionPrice: req.body.adquisitionPrice,
    personalNotes: req.body.personalNotes,
    image: `/uploads/${req.file.filename}`,
    favorite: req.body.favorite,
    sell: req.body.sell,
    // We're assuming a user is logged in here
    // If they aren't, this will throw an error
  });
  newFigure.save((err) => {
    if (err) {
      res.render('error');
    } else {
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

router.get('/:idCol/figures/:idFig', ensureLoggedIn('/login'), (req, res, next) => {
  console.log(`****************************************************** col ${req.params.idCol} - fig${req.params.idFig} `);
  Collection
    .findById(req.params.idCol)

    .populate({
      path: 'figures',
      match: {
        _id: req.params.idFig
      },
      options: {
        limit: 1
      }
    })
    .exec((err, collection) => {
      if (err) {
        return next(err);
      }
      res.render('figures/showOne', {
        user: req.user,
        collection
      });
    });
});

router.post('/:idCol/figures/:idFig', ensureLoggedIn('login'), (req, res, next) => {
  console.log(`LLEGA A POST FIGURES/ID`);
  const updates = {
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
  };
  console.log(`updates-->${updates}`);
  Figure.findByIdAndUpdate(req.params.idFig, updates, (err, figure) => {
    if (err) {
      return res.render('/', {
        figure,
        errors: figure.errors
      });
    }
    if (!figure) {
      return next(new Error('404'));
    }
    return res.redirect(`collection/${req.params.idCol}/figures/${figure._id}`);
  });
});


router.post('/:id/delete', ensureLoggedIn('login'), (req, res, next) => {
    Collection.findByIdAndRemove(req.params.id, (err, collection) => {
      if (err) {
        return next(err);
      }
      /**
       * ToDo: Delete vinculated figures.
       */
      return res.redirect('/collections');
    });
  }),

  /**
   * Search figure by: name, designer
   * Order figures by: Adquisition Price, asc or desc
   */
  router.get('/:id/search', ensureLoggedIn('login'), (req, res, next) => {
    //ToDo: Cambiar el metodo para que la RegExp pueda aceptar dos variables por parametros
    //iterate over object req.query
    let searchFilter;
    for (let param in req.query) {
      var queryRegex = new RegExp(req.query[param]);
      searchFilter = param;
      console.log('searchFilter------->', searchFilter);
    }
    /*     let filter = {};
        filter[searchFilter]=queryRegex; */
    console.log(`queryRegex--> ${queryRegex}`);

    switch (searchFilter) {
      case 'name':
        Collection
          .findById(req.params.id)
          .populate([{
            path: 'figures',
            match: {
              //Todo: cambiar name por el parametro 'param'. Ver como se puede hacer.
              name: queryRegex
            }
          }, ])
          .exec((err, collection) => {
            if (err) {
              return next(err);
            }
            console.log(`req.user--->${req.user}`);
            console.log(`collection--------> ${collection}`);
            /*         let itemsFound = collection.count('figures');
                            console.log(`itemsFound--------> ${collection.count('figures')}`); */
            res.render('collections/showOne', {
              user: req.user,
              collection
            });
          });
        break;
      case 'designer':
        Collection
          .findById(req.params.id)
          .populate([{
            path: 'figures',
            match: {
              //Todo: cambiar name por el parametro 'param'. Ver como se puede hacer.
              designer: queryRegex
            }
          }, ])
          .exec((err, collection) => {
            if (err) {
              return next(err);
            }
            console.log(`req.user--->${req.user}`);
            console.log(`collection--------> ${collection}`);
            /*         let itemsFound = collection.count('figures');
                            console.log(`itemsFound--------> ${collection.count('figures')}`); */
            res.render('collections/showOne', {
              user: req.user,
              collection
            });
          });
        break;
      case 'cheapest':
        Collection
          .findById(req.params.id)
          .populate({
            path: 'figures',
            options: {
              sort: ({
                adquisitionPrice: 'asc'
              })
            }
          })
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
        break;
      case 'expensive':
        Collection
          .findById(req.params.id)
          .populate({
            path: 'figures',
            options: {
              sort: ({
                adquisitionPrice: 'desc'
              })
            }
          })
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
        break;
      default:
        res.redirect('collections/req.params.id');
    }
  });


module.exports = router;

