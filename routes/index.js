var express = require('express');
var router = express.Router();

/* GET home page. */

 router.get('/', function(req, res, next) {
       console.log('check');
  res.render('home',{ user: req.user });
}); 
 

module.exports = router;
