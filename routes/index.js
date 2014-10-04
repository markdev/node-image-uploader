var express = require('express');
var fs = require('fs');
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
var validator = require('validator');

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
			done(null, { id: rows[0].id, name: username });
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
	if (req.originalUrl !== '/login' && req.originalUrl !== '/signup' && !req.isAuthenticated()) {
		console.log("not authenticated bitch");
		res.redirect('/login');
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
	//res.redirect('/');
	//for dev purposes:
	res.redirect('/create/new');
});

router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});

router.get('/signup', function(req, res, next) {
	res.render('signup', { 
		user: req.user,
		errors: [] 
	});
});

router.get('/search', function(req, res, next) {
	res.render('home/search', { user: req.user });
});

router.post('/signup', function(req, res, next) {
	var errors = [];
	var email = req.body.email;
	var sql = 'SELECT * FROM users WHERE email="' + email + '"';
	connection.query(sql, function(err, rows, fields) {
		// this is ghetto but that's how we're doing this
		var existingRows = 0;
		for (var key in rows) {
			existingRows++;
		}
		if (existingRows > 0) errors[errors.length] = "That email address is already in use";
		var password1 = req.body.password1;
		var password2 = req.body.password2;
		if (!validator.isEmail(email)) errors[errors.length] = "Please use a valid email address";
		if (password1 !== password2) errors[errors.length] = "Your confirm email must match";
		if (password1 == '') errors[errors.length] = "You must enter a password";
		if (password2 == '') errors[errors.length] = "You must confirm your password";
		if (errors.length == 0) {
			// Create the entry!
			var hash = crypto.createHash('md5').update(password1).digest('hex');
			var sql = 'INSERT INTO users (email, password) VALUES ("' + email + '", "' + hash + '")';
			connection.query(sql, function(err, rows, fields) {
				// now it should log them in automatically somehow...
				res.redirect('login');
			});
		} else {
			// redirect to signup with errors
			res.render('signup', {
				"errors": errors
			});
		}
	});
});


/**
*	Create
*/
router.get('/create', function(req, res, next) {
	var sql = 'SELECT * FROM contests WHERE uId="' + req.user.id + '"';
	connection.query(sql, function (err, rows, fields) {
		res.render('create/index', {
			user: req.user,
			contests: rows
		});
	});
});

router.get('/create/edit/:contestid?', function(req, res, next) {
	var contestId = req.params.contestid;
	var sql = 'SELECT * FROM contests WHERE id="' + contestId + '" LIMIT 1';
	connection.query(sql, function (err, rows, fields) {
		var deadlineArray = String(rows[0].deadline).split(" ");
		console.log(deadlineArray);
		var monthBackMap = { "Jan" : 1, "Feb" : 2, "Mar" : 3, "Apr" : 4, "May" : 5, "Jun" : 6, "Jul" : 7, "Aug" : 8, "Sep" : 9, "Oct" : 10, "Nov" : 11, "Dec" : 12 }
		var month = monthBackMap[deadlineArray[1]];
		var day = deadlineArray[2];
		var hour = deadlineArray[4].split(":")[0];
		var minute = deadlineArray[4].split(":")[0];
		console.log("month: " + month);
		console.log("day: " + day);
		console.log("hour: " + hour);
		console.log("minute: " + minute);
		var months = [
			{abbrev: "Jan", name: "January"},
			{abbrev: "Feb", name: "February"},
			{abbrev: "Mar", name: "March"},
			{abbrev: "Apr", name: "April"},
			{abbrev: "May", name: "May"},
			{abbrev: "Jun", name: "June"},
			{abbrev: "Jul", name: "July"},
			{abbrev: "Aug", name: "August"},
			{abbrev: "Sep", name: "September"},
			{abbrev: "Oct", name: "October"},
			{abbrev: "Nov", name: "November"},
			{abbrev: "Dec", name: "December"}
		];
		res.render('create/edit', { 
			user: req.user, 
			contest: rows[0],
			errors: [],
			month: month,
			months: months,
			day: day,
			hour: hour,
			minute: minute
		});
	});
});

router.get('/create/new', function(req, res, next) {
	res.render('create/new', {
		user: req.user,
		errors: [] 
	});
});


router.post('/create/new', function(req, res, next) {
	var errors = [];
	var validationObj = {};
	validationObj.title = req.body.title;
	validationObj.tags = req.body.tags;
	validationObj.banner = '';
	if (req.files.chooseFile) validationObj.banner = req.files.chooseFile.name;
	validationObj.rules = req.body.rules;
	validationObj.month = req.body.month;
	validationObj.day = req.body.day;
	validationObj.hour = req.body.hour;
	validationObj.minute = req.body.minute;
	validationObj.judging = req.body.judging;
	validationObj.competition = req.body.competition;
	var validationArray = ['title', 'tags', 'banner', 'rules', 'month', 'day', 'hour', 'minute'];
	for (var i in validationArray) {
		if (validationObj[validationArray[i]] == '' || validationObj[validationArray[i]] == undefined) {
			errors[errors.length] = "You must have a " + validationArray[i];
		}
	}
	if (errors.length == 0) {
		console.log("month: " + validationObj.month + typeof validationObj.month);
		console.log("day: " + validationObj.day + typeof validationObj.day);
		console.log("hour: " + validationObj.hour + typeof validationObj.hour);
		console.log("minute: " + validationObj.minute + typeof validationObj.minute);
		var datetime = '2014-' 
			+ validationObj.month + '-' 
			+ validationObj.day + ' ' 
			+ validationObj.hour + ':' 
			+ validationObj.minute + ':00';
		var sql = 'INSERT INTO contests (uId, title, banner, rules, deadline, judging, competition) VALUES (' +
			'"' + req.user.id + '", ' +
			'"' + validationObj.title + '", ' +
			'"' + validationObj.banner + '", ' +
			'"' + validationObj.rules + '", ' +
			'"' + datetime + '", ' +
			'"' + validationObj.judging + '", ' +
			'"' + validationObj.competition + '") ';
		connection.query(sql, function(err, rows, fields) {
			var contestId = rows.insertId;
			//move the file to the right place 
			fs.rename('uploads/' + validationObj.banner, 'public/banners/' + validationObj.banner, function(err) {
				console.log('renamed!');
			});

			var sql = "SELECT * FROM tags";
			connection.query(sql, function(err, rows, fields) {
				console.log(rows);
				var rowRemap = [];
				for (var i = 0; i<rows.length; i++) {
					rowRemap[rowRemap.length] = rows[i].content;
				}
				console.log(rowRemap);
				var tags = validationObj.tags.split(',');
				for (var i=0; i < tags.length; i++) {
					var notInArray = true;
					for (var j=0; j<rowRemap.length; j++) {
						if (tags[i] == rowRemap[j]) notInArray = false;
					}
					if (notInArray == true) {
						var sql = 'INSERT INTO tags (content) VALUES ("' + tags[i] + '")';
						connection.query(sql, function(err1, rows1, fields1) {
							console.log(rows1);
							console.log(rows1.insertId);
							var newSql = 'INSERT INTO tagAssociations (tId, cId) VALUES (' + rows1.insertId + ', ' + contestId + ')';
							console.log(newSql);
							connection.query(newSql, function (err2, rows2, fields2) {

							});
						});
					}
				};
			});
			res.redirect('/create');
		});

	} else {
		if (validationObj.banner !== '') {
			fs.unlink('uploads/' + validationObj.banner, function (err) {
				if (err) throw err;
				console.log('successfully deleted ' + validationObj.banner);	
			});
		}
		console.log("title is: " + validationObj.title);
		res.render('create/new', {
			user: req.user,
			errors: errors 
		});
	}
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
	res.render('settings/account', { 
		user: req.user,
		errors: []
	});
});

router.post('/settings/account', function(req, res, next) { 
	if (req.isAuthenticated()) {	
		if (req.files) { 
			console.log(util.inspect(req.files));
			if (!req.files.myFile || req.files.myFile.size === 0) {
			    //return next(new Error("Hey, first would you select a file?"));
			    res.render('settings/account', {
			    	user: req.user,
			    	errors: ['select a damn file']
			    });
			}
			fs.exists(req.files.myFile.path, function(exists) { 
				if(exists) { 
					res.end("Got your file!"); 
				} else { 
					res.end("Well, there is no magic for those who don’t believe in it!"); 
				} 
			});
		}
	} else {
		res.redirect('../login');
	}
});

router.get('/settings/password', function(req, res, next) {
	res.render('settings/password', { 
		user: req.user,
		errors: [] 
	});
});

router.post('/settings/password', function (req, res, next) {
	if (req.isAuthenticated()) {
		var errors = [];
		var originalPass = req.body.originalPass;
		var hash = crypto.createHash('md5').update(originalPass).digest('hex');
		var sql = 'SELECT * FROM users WHERE email="' + req.user.name + '"';
		connection.query(sql, function(err, rows, fields) {
			if (hash !== String(rows[0].password)) {
				errors[errors.length] = "That is not the password we have for you.";
			} else {
				if (req.body.newPass !== req.body.confirmPass) errors[errors.length] = "Your confirmation did not match the new password";
				if (req.body.newPass == '') errors[errors.length] = "You must enter a new password";
				if (req.body.confirmPass == '') errors[errors.length] = "You must confirm your password";
			}
			if (errors.length == 0) {
				//Update this bitch
				var newHash = crypto.createHash('md5').update(req.body.newPass).digest('hex');
				var sql = 'UPDATE users SET password="' + newHash + '" where email="' + req.user.name + '" LIMIT 1';
				connection.query(sql, function(err, rows, fields) {
					res.redirect('../settings');
				});
			} else {
				res.render('settings/password', {
					'user': req.user,
					'errors': errors
				});					
			}
		});
	} else {
		res.redirect('../login');
	}
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
