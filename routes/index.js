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
var exec = require('child_process').exec;

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
	//
	res.redirect('/compete/playByPlay/1');
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

router.get('/contest/:cId?', function(req, res, next) {
	// first we check for eligibility
	var sql = 'SELECT * FROM userRelations WHERE uId="' + req.user.id + '" AND cId="' + req.params.cId + '"';
	connection.query(sql, function(err, rows, fields) {
		console.log(rows);
		if (rows.length == 0) { // full eligibility
			var sql = 'SELECT * FROM contests WHERE id="' + req.params.cId + '" LIMIT 1';
			connection.query(sql, function(err, rows, fields) {
				res.render('home/contest', {
					user: req.user,
					contest: rows[0],
					errors: [],
					entries: 34,
					judges: 120
				});
			});
		} else {
			var relationship = rows[0].relationship;
			if (relationship == 'judge') res.redirect('/judge');
			if (relationship == 'competitor') res.redirect('/compete');
			if (relationship == 'creator') res.redirect('/creator');
		}
	});
});

router.post('/contest/', function (req, res, next) {
	var processSignUp = function(relationship, url) {
		var sql = 'SELECT * FROM userRelations WHERE uId="' + req.user.id + '" AND cId="' + req.body.cId + '"';
		connection.query(sql, function(err, rows, fields) {
			if (rows.length == 0) {
				var sql = 'INSERT INTO userRelations (uId, cId, relationship) VALUES (' + req.user.id + ', ' + req.body.cId + ', "' + relationship + '")';
				connection.query(sql, function(err, rows, fields) {
					res.redirect(url);
				});
			} else {
				res.redirect('/contest/' + req.body.cId);
			}
		});		
	};
	if (req.body.submit == "Judge") { 
		processSignUp('judge', '/judge');
	} else if (req.body.submit == "Compete") {
		processSignUp('competitor', '/compete');
	} else {
		console.log("some sorta error");
	}
});

router.get('/search', function(req, res, next) {
	res.render('home/search', {
		user: req.user,
		contests: [] 
	});
});

router.post('/search', function(req, res, next) {
	// first we are going to search for tags
	console.log(req.body.search);

	var sql = 'SELECT * FROM contests JOIN tagAssociations ON contests.id = tagAssociations.cId WHERE tagAssociations.tId=(SELECT id FROM tags WHERE content="' + req.body.search + '")';
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
		console.log(rows);
		res.render('home/search', {
			user: req.user,
			contests: rows 
		});
	});
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


router.post('/create/edit', function(req, res, next) {
	var createTagAssociation = function (tId, cId) {
		var sql = 'INSERT INTO tagAssociations (tId, cId) VALUES (' + tId + ', ' + cId + ')';
		connection.query(sql, function (err, rows, fields) {
			return;
		});
	};

	var processTag = function (rawTag, contestId) {
		var tag = String(rawTag).trim();
		var sql = 'SELECT * FROM tags WHERE content="' + tag + '"';
		connection.query(sql, function(err, rows, fields) {
			if (rows.length > 0) { //if the tag already exists
				var tId = rows[0].id;
				createTagAssociation(tId, contestId);
			} else {
				var sql = 'INSERT INTO tags (content) VALUES ("' + tag + '")';
				connection.query(sql, function (err, rows, fields) {
					createTagAssociation(rows.insertId, contestId);
				});
			}
		});		
	};

	var contestId = req.body.contestId;
	var dateTime = '2014-' 
		+ req.body.month + '-' 
		+ req.body.day + ' ' 
		+ req.body.hour + ':' 
		+ req.body.minute + ':00';
	var sql = "SELECT * FROM contests WHERE id=" + req.body.contestId;
	connection.query(sql, function(err, rows, fields) {
		var dateTimeArray = String(rows[0].deadline).split(' ');
		console.log(dateTimeArray);
		var errors = 0;
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		if (months[req.body.month - 1] != dateTimeArray[1]) errors++;
		if (parseInt(req.body.day) != parseInt(dateTimeArray[2])) errors++;
		if (req.body.hour != dateTimeArray[4].split(':')[0]) errors++;
		if (req.body.minute != dateTimeArray[4].split(':')[1]) errors++;
		if (errors) {
			//update datetime
			var sql = 'UPDATE contests SET deadline="' + dateTime + '" WHERE id="' + req.body.contestId +'"';
			connection.query(sql, function (err1, rows1, fields1) {
				// good enough I guess
				res.redirect('/create');
			});
		}
		console.log(errors);
	});
	// tags
	var tagArray = req.body.tags.split(",");
	// first remove all associations with the contest in the database
	var sql = 'DELETE FROM tagAssociations WHERE cId=' + contestId;
	connection.query(sql, function(err, rows, fields) {
		for (var i in tagArray) {
			processTag(tagArray[i], contestId);
		}		
	});
	res.redirect('/create');
	// oh and messages will get sent. bleh
});

router.get('/create/edit/:contestId?', function(req, res, next) {
	var contestId = req.params.contestId;
	var sql = 'SELECT * FROM contests WHERE id="' + contestId + '" LIMIT 1';
	connection.query(sql, function (err, rows, fields) {
		var title = rows[0].title;
		var deadlineArray = String(rows[0].deadline).split(" ");
		var monthBackMap = { "Jan" : 1, "Feb" : 2, "Mar" : 3, "Apr" : 4, "May" : 5, "Jun" : 6, "Jul" : 7, "Aug" : 8, "Sep" : 9, "Oct" : 10, "Nov" : 11, "Dec" : 12 }
		var month = monthBackMap[deadlineArray[1]];
		var day = deadlineArray[2];
		var hour = deadlineArray[4].split(":")[0];
		var minute = deadlineArray[4].split(":")[1];
		var rules = rows[0].rules;
		var judging = rows[0].judging;
		var competition = rows[0].competition;
		var banner = rows[0].banner;
		var months = [
			{num: 1, abbrev: "Jan", name: "January", selected : false},
			{num: 2, abbrev: "Feb", name: "February", selected : false},
			{num: 3, abbrev: "Mar", name: "March", selected : false},
			{num: 4, abbrev: "Apr", name: "April", selected : false},
			{num: 5, abbrev: "May", name: "May", selected : false},
			{num: 6, abbrev: "Jun", name: "June", selected : false},
			{num: 7, abbrev: "Jul", name: "July", selected : false},
			{num: 8, abbrev: "Aug", name: "August", selected : false},
			{num: 9, abbrev: "Sep", name: "September", selected : false},
			{num: 10, abbrev: "Oct", name: "October", selected : false},
			{num: 11, abbrev: "Nov", name: "November", selected : false},
			{num: 12, abbrev: "Dec", name: "December", selected : false}
		];
		for (var i in months) {
			if (months[i].num == month) {
				months[i].selected = true;
			}
		}
		var days = [];
		for (var i = 1; i<=31; i++) days[days.length] = i;
		var hours = [];
		for (var i = 1; i<=23; i++) hours[hours.length] = i;
		var minutes = [];
		for (var i = 5; i<=55; i+=5) minutes[minutes.length] = i;
		// and now, the tags
		var sql = "SELECT content FROM tags JOIN tagAssociations ON tags.id = tagAssociations.tId WHERE tagAssociations.cId = " + contestId;
		connection.query(sql, function(err, rows, fields) {
			var tagArray = [];
			for (var i in rows) tagArray[tagArray.length] = rows[i].content;
			var tagString = tagArray.join(", ");
		console.log(banner);
			
			res.render('create/edit', { 
				user: req.user, 
				contestId: contestId,
				contest: rows[0],
				errors: [],
				title: title,
				tags: tagString,
				rules: rules,
				banner: banner,
				month: month,
				months: months,
				day: day,
				days: days,
				hour: hour,
				hours: hours,
				minute: minute,
				minutes: minutes,
				judging: judging,
				competition: competition
			});
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

	var createTagAssociation = function (tId, cId) {
		var sql = 'INSERT INTO tagAssociations (tId, cId) VALUES (' + tId + ', ' + cId + ')';
		connection.query(sql, function (err, rows, fields) {
			return;
		});
	};

	var processTag = function (rawTag, contestId) {
		var tag = String(rawTag).trim();
		var sql = 'SELECT * FROM tags WHERE content="' + tag + '"';
		connection.query(sql, function(err, rows, fields) {
			if (rows.length > 0) { //if the tag already exists
				var tId = rows[0].id;
				createTagAssociation(tId, contestId);
			} else {
				var sql = 'INSERT INTO tags (content) VALUES ("' + tag + '")';
				connection.query(sql, function (err, rows, fields) {
					createTagAssociation(rows.insertId, contestId);
				});
			}
		});		
	};

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
			//create the relationship
			var sql = 'INSERT INTO userRelations (uId, cId, relationship) VALUES ("' + req.user.id + '", "' + contestId + '", "creator")';
			connection.query(sql, function(err, rows, fields) {
				res.redirect('/create');
			});
			var tagArray = req.body.tags.split(",");
			for (var i in tagArray) {
				processTag(tagArray[i], contestId);
			}
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
	var sql = 'SELECT c.id, c.title, c.banner, c.rules, c.deadline, c.judging, c.competition, u.relationship, (SELECT COUNT(*) FROM entries WHERE cId = c.id) AS entries, (SELECT COUNT(*) FROM userRelations WHERE relationship="judge" AND cId = c.id) AS judges FROM contests as c JOIN userRelations as u ON c.id = u.cId WHERE u.uId=' + req.user.id + ' AND u.relationship="judge"';
	connection.query(sql, function (err, rows, fields) {
		console.log(rows);
		res.render('judge/index', {
			user: req.user,
			contests: rows
		});
	});
});








router.get('/judge/contest/:cId?', function(req, res, next) {
	//1: validate.  If you ain't a judge, you get bounced.
	var sql = 'SELECT * FROM userRelations WHERE uId="' + req.user.id + '" AND cId="' + req.params.cId + '" LIMIT 1';
	connection.query(sql, function (err, rows, fields) {
		if (rows.length == 0 || rows[0].relationship != 'judge') {
			res.redirect("/judge");
		} else {
			//2: get contest data
			var sql = 'SELECT * FROM contests WHERE id="' + req.params.cId + '" LIMIT 1';
			connection.query(sql, function (err, rows, fields) {
			var contest = rows[0];
				res.render('judge/contest', { 
					user: req.user,
					contest: contest,
					entries: []
				});
			});			
		}
	});	
});

router.post('/judge/contest/getNewEntry', function(req, res, next) {
	var data = JSON.parse(req.body.jsonData);
	var queryPhrase = '';
	if (data.entries.length > 0) {
		queryPhrase = ' AND entries.id NOT IN (';
		var existingEntries = [];
		for (var i = 0; i<data.entries.length; i++) {
			existingEntries[existingEntries.length] = data.entries[i].eId
		}
		queryPhrase += existingEntries.join(', ');
		queryPhrase += ') ';
	}
	var sql = 'SELECT * FROM entries WHERE entries.cId="' + data.cId + '" AND entries.id NOT IN (SELECT eId FROM judges WHERE uId="' + req.user.id + '" AND cId="' + data.cId + '") ' + queryPhrase + ' ORDER BY RAND() LIMIT 1';
	console.log(sql);
	connection.query(sql, function (err, rows, fields) {
		//console.log(req.body);
		res.send(rows);
	});
});

router.post('/judge/contest/submitRating', function(req, res, next) {
	var sql = 'SELECT * FROM judges WHERE uId="' + req.user.id + '" AND cId="' + req.body.cId + '" AND eId="' + req.body.eId + '"';
	connection.query(sql, function (err, rows, fields) {
		if (rows.length > 0) {
			// entry exists; update it
			var sql = 'UPDATE judges SET rating="' + req.body.rating + '", judgedOn=NOW() WHERE uId="' + req.user.id + '" AND cId="' + req.body.cId + '" AND eId="' + req.body.eId + '"';
			connection.query(sql, function (err, rows, fields) {
				console.log(rows);
				res.send(req.body.rating);
			});
		} else {
			// no entry; create it
			var sql = 'INSERT INTO judges (uId, cId, eId, rating, judgedOn) VALUES ("' + req.user.id + '", "' + req.body.cId + '", "' + req.body.eId + '", "' + req.body.rating + '", NOW())';
			connection.query(sql, function (err, rows, fields) {
				console.log(rows);
				res.send(req.body.rating);
			});
		}
	});
});

router.get('/judge/report', function(req, res, next) {
	res.render('judge/report', { user: req.user });
});




/**
*	Compete
*/
router.get('/compete', function(req, res, next) {
	//var sql = 'SELECT * FROM contests JOIN userRelations ON contests.id = userRelations.cId WHERE userRelations.uId=' + req.user.id + ' AND userRelations.relationship="competitor"';
	var sql = 'SELECT c.id, c.title, c.banner, c.rules, c.deadline, c.judging, c.competition, u.relationship, (SELECT COUNT(*) FROM entries WHERE cId = c.id) AS entries, (SELECT COUNT(*) FROM userRelations WHERE relationship="judge" AND cId = c.id) AS judges FROM contests as c JOIN userRelations as u ON c.id = u.cId WHERE u.uId=' + req.user.id + ' AND u.relationship="competitor"';
	
	connection.query(sql, function (err, rows, fields) {
		res.render('compete/index', {
			user: req.user,
			contests: rows
		});
	});
});

router.get('/compete/results', function(req, res, next) {
	res.render('compete/results', { user: req.user });
});

router.get('/compete/playByPlay/:eId?', function(req, res, next) {
	var sql = 'SELECT * FROM contests WHERE id = (SELECT cId FROM entries WHERE id = "' + req.params.eId + '")';
	connection.query(sql, function (err, rows, fields) {
		var contest = rows[0];
		var sql = 'SELECT e.id, e.uId, e.cId, e.picture, (SELECT AVG(rating) as score FROM judges WHERE eId = e.id) AS score, (SELECT count(*) FROM judges WHERE eId = e.id) AS judges FROM entries as e WHERE cId ="' + contest.id + '" ORDER BY score desc';
		connection.query(sql, function (err, rows, fields) {
			var entries = rows;
			console.log(entries);
			res.render('compete/playByPlay', { 
				user: req.user,
				entries: entries,
				contest: contest 
			});
		});
	});	
});

router.get('/compete/submit/:cId?', function(req, res, next) {
	// first, is he even in this thing?
	var sql = 'SELECT * FROM userRelations WHERE uId="' + req.user.id + '" AND cId="' + req.params.cId + '" AND relationship="competitor"';
	connection.query(sql, function(err, rows, fields) {
		if (rows.length == 0) { // if he is not registered
			res.redirect('/compete');
		} else {
			// second, has he submitted an entry yet?
			var sql = 'SELECT * FROM entries WHERE uId="' + req.user.id + '" AND cId="' + req.params.cId + '"'; 
			connection.query(sql, function(err, rows, fields) {
				if (rows.length > 0) { // if he has already submitted an entry
					res.redirect('/compete/playByPlay');
				} else {
					// now pull the contest data and give it to him
					var sql = 'SELECT * FROM contests WHERE id="' + req.params.cId + '"';
					connection.query(sql, function(err, rows, fields) {
						res.render('compete/submit', { 
							user: req.user,
							contest: rows[0],
							errors: [] 
						});
					});
				}
			});		
		}
	});
});

router.post('/compete/submit', function(req, res, next) {
	var errors = []; // I'll have to figure out the right way to do errors later
	if (req.files.chooseFile == undefined) {
		console.log("HELLO");
		errors[errors.length] = "Please upload a file";
		res.redirect('/compete/submit/' + req.body.cId);
	} else {
		// create the database entry
		console.log(req.files.chooseFile);
		var sql = 'INSERT INTO entries (uId, cId, picture, uploadTime) VALUES ("' + req.user.id + '", "' + req.body.cId + '", "' + req.files.chooseFile.name + '", NOW())';
		connection.query(sql, function(err, rows, fields) { 
			// now move the file		
			fs.rename('uploads/' + req.files.chooseFile.name, 'public/entries/' + req.files.chooseFile.name, function(err) {
				console.log(req.files.chooseFile.name + " has been renamed!");
				// resize the file
				exec('convert public/entries/' + req.files.chooseFile.name + ' -resize 400x600 public/entries/' + req.files.chooseFile.name, function(err, stdout, stderr) {
					console.log(req.files.chooseFile.name + " has been resized!");
					res.redirect('/compete');
				});
			});
		});
	}
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
