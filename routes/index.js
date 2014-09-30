var express = require('express');
var router = express.Router();
var basicAuth = require('basic-auth');

// raw http auth for dev
router.use(function (req, res, next) {
    var unauthorized = function (res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };
    var user = basicAuth(req);
    return unauthorized(res);
    //if (!user || !user.name || !user.pass) return unauthorized(res);
    //return (user.name === 'foo' && user.pass === 'bar')? next() : unauthorized(res);
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Login' });
});

router.get('/signup', function(req, res, next) {
	res.render('signup', { title: 'Sign Up' });
});

module.exports = router;
