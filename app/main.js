'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _pbkdf2Password = require('pbkdf2-password');

var _pbkdf2Password2 = _interopRequireDefault(_pbkdf2Password);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _articles = require('./routes/articles');

var _articles2 = _interopRequireDefault(_articles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasher = (0, _pbkdf2Password2.default)();
var port = process.env.PORT || 3000;
var jsonParser = _bodyParser2.default.json();
var urlencodedParser = _bodyParser2.default.urlencoded({ extended: false });

// import db from './db.js';

// import myFunc from './config/passport';
// myFund(passport);

var app = (0, _express2.default)();

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(_express2.default.static(__dirname + '/public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
	}
}));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

app.get('/', function (req, res) {

	res.render('index', { user: 'sex' });
});

app.get('/hello', function (req, res) {

	return res.send('Can you hear me?');
});

//require('./routes/registerRoutes.js')(app,passport);
// require('./routes/aboutRoutes.js')(app);
app.use('/articles', _articles2.default);

var server = app.listen(3000, function () {
	console.log('Express listening on port 3000');
});