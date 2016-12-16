'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use(function (req, res, next) {
	var today = new Date();
	var todayFull = Number(today.getFullYear()) + '-' + Number(today.getMonth() + 1) + '-' + Number(today.getDate()) + '-' + Number(today.getHours()) + ':' + Number(today.getMinutes());
	console.log('Time: ', todayFull);
	next();
});
router.get('/', function (req, res) {
	res.send('articlesasdfasdf');
});

router.get('/read/:id', function (req, res) {
	res.send('You are reading article' + req.params.id);
});

exports.default = router;