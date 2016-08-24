var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.locals.message = req.session.message;
  res.locals.username = req.session.username;
  res.locals.authenticated = req.session.logined;
  req.session.message = null;
  res.render('index', { title: '交通資訊平台' });
});


module.exports = router;
