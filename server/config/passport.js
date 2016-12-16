var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var KakaoStrategy = require("passport-kakao").Strategy;
var crypto = require('crypto');
var db = require('../db.js');


export default function(passport){
	
	passport.serializeUser((user,cb) => {
	  console.log("serializeUser : "+user);
	  cb(null, user);
	});

	passport.deserializeUser((obj,cb) => {
	  console.log("deserializeUser : "+obj);
	  cb(null, obj);
	});

	passport.use( new KakaoStrategy({
        clientID: '',
        callbackURL: ""
    },
    (accessToken, refreshToken, params, profile, cb) =>{
        // authorization 에 성공했을때의 액션
        console.log( "accessToken :" + accessToken );
        console.log( "params :" + params );
        var kuser = JSON.stringify(profile._json);
        console.log(profile.username);
        console.log("사용자 profile: " + JSON.stringify(profile._json));
        var authId='kakao:'+profile.id;

        db.users.findOne({where : {authId : authId}}).then((result) =>{
        	if(result)
	    	{
	    		console.log("카카오톡 계정이 존재합니다.");
	    		var userInfo = {
	    			'provider' : 'kakao',
	    			'authId' : authId,
	    			'username' : result.username,
	    			'displayName' : result.displayName,
	    			'phonenumber' : result.phonenumber,
	    			'authId' : result.authId,
	    			'email' : result.email,
	    			'option01' : result.option01,
	    			'option02' : result.option02,
	    			'gender' : result.gender,
	    			'photo' : profile._json.properties.thumbnail_image,
	    			'job' : result.job,
	    			'createdAt' : result.createdAt
	    		}
	    		console.log(userInfo.photo)
	    		return cb(null, userInfo);

	    	}else{

	    		console.log("카카오 계정이 존재하지 않습니다.회원가입 페이지로 이동합니다")

	    		var sessionInfo = {
	    			'authId' : authId,
	    			'username' : profile.username
	    		}
	    		console.log("카카오 가입 시도 사용자 정보 : "+sessionInfo.username);
	    		return cb(null,sessionInfo);
	    	}

        });

    })
	);

	passport.use(new FacebookStrategy({
	    clientID: '',
	    clientSecret: '',
	    callbackURL: '',
	    profileFields:['id', 'email', 'gender', 'picture' ,'link', 'updated_time', 'locale', 'name', 'timezone', 'verified', 'displayName']
    },(accessToken, refreshToken, profile, cb) => {
	    console.log("passport Strategy : "+profile);
	    console.log("accessToken : "+accessToken);
	    console.log("refreshToken : "+refreshToken);
	    console.log("picture : "+profile.photos[0].value);
	    console.log("페이스북 로그인을 시도하고 있습니다.")
	    var authId = 'facebook:'+profile.emails[0].value;
	    console.log(authId);

	    db.users.findOne({where : {authId : authId}}).then((result)=>{
	    	if(result)
	    	{
	    		console.log("페이스북 계정이 존재합니다.");
	    		var userInfo = {
	    			'provider' : 'facebook',
	    			'authId' : authId,
	    			'username' : result.username,
	    			'displayName' : result.displayName,
	    			'phonenumber' : result.phonenumber,
	    			'authId' : result.authId,
	    			'email' : result.email,
	    			'option01' : result.option01,
	    			'option02' : result.option02,
	    			'job' : result.job,
	    			'gender' : result.gender,
	    			'photo' : profile.photos[0].value,
	    			'createdAt' : result.createdAt
	    		}
	    		
	    		return cb(null, userInfo);

	    	}else{
	    		console.log("페이스북 계정이 존재하지 않습니다.회원가입 페이지로 이동합니다")
	    		var sessionInfo = {
	    			'authId' : authId,
	    			'username' : profile.displayName,
	    			'email' : profile.emails[0].value,
	    		}
	    		console.log("페이스북 가입 시도 사용자 정보 : "+sessionInfo);
	    		return cb(null,sessionInfo);
	    	}

	    })
     }));


	passport.use(new LocalStrategy({
        usernameField : 'useremail',
        passwordField : 'password',
        passReqToCallback : true
    }
    ,(req,useremail, password, done) => {

    	console.log('LocalStrategy')
    	var authId='local:'+useremail;
    	  db.users.findOne({where : {authId : authId}}).then((user) =>{
    	  	if(user)
    	  	{
    	  		 console.log("user :-> "+user);
	    	     console.log("user.dataValues :->"+user.dataValues);
	    	     //dataValues 뽑아 내서 값 비교후 넘기기
	             var shasum = crypto.createHash('sha1');
	             shasum.update(password);
	             var ePass = shasum.digest('hex');
	    
		         if(user.dataValues.password==ePass){
		         	if(user.option02=='null')
		         	{
		         		var userInfo = {
		    			'provider' : 'local',
		    			'authId' : user.authId,
		    			'username' : user.username,
		    			'displayName' : user.displayName,
		    			'phonenumber' : user.phonenumber,
		    			'authId' : user.authId,
		    			'email' : user.email,
		    			'option01' : user.option01,
		    			'option02' : user.option02,
		    			'job' : user.job,
		    			'gender' : user.gender,
		    			'photo' : 'https://s3.ap--2.amazonaws.com/inbyu/img/localImage.png',
		    			'createdAt' : user.createdAt
			         	}
			         }
		         	else
		         	{
		         		var userInfo = {
		    			'provider' : 'local',
		    			'authId' : user.authId,
		    			'username' : user.username,
		    			'displayName' : user.displayName,
		    			'phonenumber' : user.phonenumber,
		    			'authId' : user.authId,
		    			'email' : user.email,
		    			'option01' : user.option01,
		    			'option02' : user.option02,
		    			'job' : user.job,
		    			'gender' : user.gender,
		    			'photo' : 'https://s3.ap--2.amazonaws.com/inbyu/img/corImage.png',
		    			'createdAt' : user.createdAt

		         		}
		         	
	    			
	    			}
		            return done(null,userInfo);
		         }else{
		            return done(null,false);
		         }

    	  	}
    	  	else
    	  	{
    	  		return done(null,false);
    	  	}
    	  });
	    }
	));

}