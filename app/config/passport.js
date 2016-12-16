'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (passport) {

	passport.serializeUser(function (user, cb) {
		console.log("serializeUser : " + user);
		cb(null, user);
	});

	passport.deserializeUser(function (obj, cb) {
		console.log("deserializeUser : " + obj);
		cb(null, obj);
	});

	passport.use(new KakaoStrategy({
		clientID: '',
		callbackURL: ""
	}, function (accessToken, refreshToken, params, profile, cb) {
		// authorization 에 성공했을때의 액션
		console.log("accessToken :" + accessToken);
		console.log("params :" + params);
		var kuser = JSON.stringify(profile._json);
		console.log(profile.username);
		console.log("사용자 profile: " + JSON.stringify(profile._json));
		var authId = 'kakao:' + profile.id;

		db.users.findOne({ where: { authId: authId } }).then(function (result) {
			if (result) {
				var _userInfo;

				console.log("카카오톡 계정이 존재합니다.");
				var userInfo = (_userInfo = {
					'provider': 'kakao',
					'authId': authId,
					'username': result.username,
					'displayName': result.displayName,
					'phonenumber': result.phonenumber
				}, _defineProperty(_userInfo, 'authId', result.authId), _defineProperty(_userInfo, 'email', result.email), _defineProperty(_userInfo, 'option01', result.option01), _defineProperty(_userInfo, 'option02', result.option02), _defineProperty(_userInfo, 'gender', result.gender), _defineProperty(_userInfo, 'photo', profile._json.properties.thumbnail_image), _defineProperty(_userInfo, 'job', result.job), _defineProperty(_userInfo, 'createdAt', result.createdAt), _userInfo);
				console.log(userInfo.photo);
				return cb(null, userInfo);

			} else {

				console.log("카카오 계정이 존재하지 않습니다.회원가입 페이지로 이동합니다");

				var sessionInfo = {
					'authId': authId,
					'username': profile.username
				};
				console.log("카카오 가입 시도 사용자 정보 : " + sessionInfo.username);
				return cb(null, sessionInfo);
			}
		});
	}));

	passport.use(new FacebookStrategy({
		clientID: '',
		clientSecret: '',

		callbackURL: '',
		profileFields: ['id', 'email', 'gender', 'picture', 'link', 'updated_time', 'locale', 'name', 'timezone', 'verified', 'displayName']
	}, function (accessToken, refreshToken, profile, cb) {
		console.log("passport Strategy : " + profile);
		console.log("accessToken : " + accessToken);
		console.log("refreshToken : " + refreshToken);
		console.log("picture : " + profile.photos[0].value);
		console.log("페이스북 로그인을 시도하고 있습니다.");
		var authId = 'facebook:' + profile.emails[0].value;
		console.log(authId);

		db.users.findOne({ where: { authId: authId } }).then(function (result) {
			if (result) {
				var _userInfo2;

				console.log("페이스북 계정이 존재합니다.");
				var userInfo = (_userInfo2 = {
					'provider': 'facebook',
					'authId': authId,
					'username': result.username,
					'displayName': result.displayName,
					'phonenumber': result.phonenumber
				}, _defineProperty(_userInfo2, 'authId', result.authId), _defineProperty(_userInfo2, 'email', result.email), _defineProperty(_userInfo2, 'option01', result.option01), _defineProperty(_userInfo2, 'option02', result.option02), _defineProperty(_userInfo2, 'job', result.job), _defineProperty(_userInfo2, 'gender', result.gender), _defineProperty(_userInfo2, 'photo', profile.photos[0].value), _defineProperty(_userInfo2, 'createdAt', result.createdAt), _userInfo2);

				return cb(null, userInfo);
			} else {
				console.log("페이스북 계정이 존재하지 않습니다.회원가입 페이지로 이동합니다");
				var sessionInfo = {
					'authId': authId,
					'username': profile.displayName,
					'email': profile.emails[0].value
				};
				console.log("페이스북 가입 시도 사용자 정보 : " + sessionInfo);
				return cb(null, sessionInfo);
			}
		});
	}));

	passport.use(new LocalStrategy({
		usernameField: 'useremail',
		passwordField: 'password',
		passReqToCallback: true
	}, function (req, useremail, password, done) {

		console.log('LocalStrategy');
		var authId = 'local:' + useremail;
		db.users.findOne({ where: { authId: authId } }).then(function (user) {
			if (user) {
				console.log("user :-> " + user);
				console.log("user.dataValues :->" + user.dataValues);
				//dataValues 뽑아 내서 값 비교후 넘기기
				var shasum = crypto.createHash('sha1');
				shasum.update(password);
				var ePass = shasum.digest('hex');

				if (user.dataValues.password == ePass) {
					if (user.option02 == 'null') {
						var _userInfo3;

						var userInfo = (_userInfo3 = {
							'provider': 'local',
							'authId': user.authId,
							'username': user.username,
							'displayName': user.displayName,
							'phonenumber': user.phonenumber
						}, _defineProperty(_userInfo3, 'authId', user.authId), _defineProperty(_userInfo3, 'email', user.email), _defineProperty(_userInfo3, 'option01', user.option01), _defineProperty(_userInfo3, 'option02', user.option02), _defineProperty(_userInfo3, 'job', user.job), _defineProperty(_userInfo3, 'gender', user.gender), _defineProperty(_userInfo3, 'photo', 'https://s3.ap-northeast-2.amazonaws.com/inbyu/img/localImage.png'), _defineProperty(_userInfo3, 'createdAt', user.createdAt), _userInfo3);
					} else {
						var _userInfo4;

						var userInfo = (_userInfo4 = {
							'provider': 'local',
							'authId': user.authId,
							'username': user.username,
							'displayName': user.displayName,
							'phonenumber': user.phonenumber
						}, _defineProperty(_userInfo4, 'authId', user.authId), _defineProperty(_userInfo4, 'email', user.email), _defineProperty(_userInfo4, 'option01', user.option01), _defineProperty(_userInfo4, 'option02', user.option02), _defineProperty(_userInfo4, 'job', user.job), _defineProperty(_userInfo4, 'gender', user.gender), _defineProperty(_userInfo4, 'photo', 'https://s3.ap-northeast-2.amazonaws.com/inbyu/img/corImage.png'), _defineProperty(_userInfo4, 'createdAt', user.createdAt), _userInfo4);
					}
					return done(null, userInfo);
				} else {
					return done(null, false);
				}
			} else {
				return done(null, false);
			}
		});
	}));
};

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var KakaoStrategy = require("passport-kakao").Strategy;
var crypto = require('crypto');
var db = require('../db.js');