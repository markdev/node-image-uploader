var basicAuth = require('basic-auth');

var httpAuth = function (req, res, next) {
    var unauthorized = function (res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };
    var user = basicAuth(req);
    if (!user || !user.name || !user.pass) return unauthorized(res);
    return (user.name === 'foo' && user.pass === 'bar')? next() : unauthorized(res);
};

exports.httpAuth = httpAuth;
/*
var bounce = function (req, res, next) {
	if (req.originalUrl !== '/login') {
		if (!req.isAuthenticated()) {
			console.log("not authenticated bitch");
			res.redirect('login');
		}
	} else {
		next();
	}
};

exports.bounce = bounce;
*/