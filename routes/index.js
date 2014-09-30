var express = require('express');
var util = require('util');
var router = express.Router();
var basicAuth = require('basic-auth');
var auth = require('../my_modules/auth');


router.use(auth.authorize);

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('home/index', { title: 'Express', user: {name: 'Mark'} });
});

router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Login' });
});

router.get('/signup', function(req, res, next) {
	res.render('signup', { title: 'Sign Up' });
});

module.exports = router;
