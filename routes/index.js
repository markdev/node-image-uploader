var express = require('express');
var crypto = require('crypto');
var mysql = require('mysql');
var util = require('util');
var router = express.Router();
var basicAuth = require('basic-auth');
var auth = require('../my_modules/auth');
var passport = require('passport');
var passportLocal = require('passport-local');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'g0disan4sshole',
	database : 'sunzora1'
});

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
	var hash = crypto.createHash('md5').update(password).digest('hex');
	var sql = 'SELECT * FROM users WHERE email="' + username + '" AND password="' + hash + '" LIMIT 1';
	connection.query(sql, function(err, rows, fields) {
		if (rows[0] && username === rows[0].email && hash === rows[0].password) {
			done(null, { id: username, name: username });
		} else {
			done(null, null);
		}
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	// Query database or cache here
	done(null, { id: id, name: id });
});

router.use(function(req, res, next) {
	console.log(req.isAuthenticated());
	if (req.originalUrl !== '/login' && !req.isAuthenticated()) {
		console.log("not authenticated bitch");
		res.redirect('login');
	} else {
		next();
	}
});


//router.locals.myVariable = 'This is my variable';
//router.set('myVariable', 'This is my variable');
//var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
		res.render('home/index', { 
			title: 'Express',
			user: req.user 
		});
});

router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
	res.redirect('/');
});

router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});

router.get('/signup', function(req, res, next) {
	res.render('signup', { user: req.user });
});

router.get('/search', function(req, res, next) {
	res.render('home/search', { user: req.user });
});



/**
*	Create
*/
router.get('/create', function(req, res, next) {
	res.render('create/index', { user: req.user });
});

router.get('/create/edit', function(req, res, next) {
	res.render('create/edit', { user: req.user });
});

router.get('/create/new', function(req, res, next) {
	res.render('create/new', { user: req.user });
});

router.get('/create/police', function(req, res, next) {
	res.render('create/police', { user: req.user });
});



/**
*	Messages
*/
router.get('/messages', function(req, res, next) {
	res.render('messages/index', { user: req.user });
});

router.get('/messages/message', function(req, res, next) {
	res.render('messages/message', { user: req.user });
});



/**
*	Judge
*/
router.get('/judge', function(req, res, next) {
	res.render('judge/index', { user: req.user });
});

router.get('/judge/contest', function(req, res, next) {
	res.render('judge/contest', { user: req.user });
});

router.get('/judge/report', function(req, res, next) {
	res.render('judge/report', { user: req.user });
});




/**
*	Compete
*/
router.get('/compete', function(req, res, next) {
	res.render('compete/index', { user: req.user });
});

router.get('/compete/results', function(req, res, next) {
	res.render('compete/results', { user: req.user });
});

router.get('/compete/playByPlay', function(req, res, next) {
	res.render('compete/playByPlay', { user: req.user });
});

router.get('/compete/submit', function(req, res, next) {
	res.render('compete/submit', { user: req.user });
});




/**
*	Settings
*/
router.get('/settings', function(req, res, next) {
	res.render('settings/index', { user: req.user });
});

router.get('/settings/account', function(req, res, next) {
	res.render('settings/account', { user: req.user });
});

router.get('/settings/password', function(req, res, next) {
	res.render('settings/password', { 
		user: req.user 
	});
});

router.get('/settings/awards', function(req, res, next) {
	res.render('settings/awards', { user: req.user });
});

router.get('/settings/terms', function(req, res, next) {
	res.render('settings/terms', { user: req.user });
});

router.get('/settings/contact', function(req, res, next) {
	res.render('settings/contact', { user: req.user });
});




module.exports = router;
