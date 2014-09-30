var express = require('express');
var util = require('util');
var router = express.Router();
var basicAuth = require('basic-auth');
var auth = require('../my_modules/auth');
var passport = require('passport');
var passportLocal = require('passport-local');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');


router.use(auth.httpAuth); 

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(expressSession({ 
	secret: process.env.SESSION_SECRET || 'secret',
	resave: false,
	saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new passportLocal.Strategy(function(username, password, done) {
	if (username == password) {
		//we can configure this user object however we wish
		console.log("it IS the same as the password");
		done(null, { id: username, name: username });
	} else {
		console.log("it is NOT the same as the password");
		done(null, null);
	}
	/*
	var hash = crypto.createHash('md5').update(password).digest('hex');
	var sql = 'SELECT * FROM users WHERE email="' + username + '" AND password="' + hash + '" LIMIT 1';
	connection.query(sql, function(err, rows, fields) {
		if (rows[0] && username === rows[0].email && hash === rows[0].password) {
			done(null, { id: username, name: username });
		} else {
			done(null, null);
		}
	});
	*/
}));
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	// Query database or cache here
	done(null, { id: id, name: id });
});

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.isAuthenticated());
	if (req.isAuthenticated()) {
		res.render('home/index', { 
			title: 'Express',
			user: req.user 
		});
	} else {
		res.redirect('login');
	}
});

router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
	res.redirect('/');
});

router.get('/signup', function(req, res, next) {
	res.render('signup', { title: 'Sign Up' });
});

module.exports = router;
