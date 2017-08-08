var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('main',{user: req.user});
});

  router.get('/:email', function(req, res, next) {
  res.render('home',{ user: req.user });
});  

module.exports = router;
