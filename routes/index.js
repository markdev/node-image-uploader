var express = require('express');
var router = express.Router();
var basicAuth = require('basic-auth');

// raw http auth for dev
var auth = function (req, res, next) {
    var unauthorized = function (res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };
    var user = basicAuth(req);
    if (!user || !user.name || !user.pass) return unauthorized(res);
    return (user.name === 'foo' && user.pass === 'bar')? next() : unauthorized(res);
};

/* GET home page. */
router.get('/', auth, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
