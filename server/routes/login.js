import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';

const router = express.Router();

	router.use((req,res,next) => {
		var today = new Date();
		var todayFull = Number(today.getFullYear())+'-'+Number(today.getMonth()+1)+'-'+Number(today.getDate())+'-'+Number(today.getHours())+':'+Number(today.getMinutes());
		console.log('Time: ',todayFull);
		next();
	});

	router.get('/',(req,res) => {
		res.send('로그인 페이지입니다');
	});


	router.get('/login_fail',function(req,res){
		res.send('로그인에 실패했습니다');
	})

	////////////////로그인 하기///////////////
	///1. local login
	router.post('/local',
    passport.authenticate('local', { failureRedirect: '/login/login_fail' }),
	    function(req, res) {
	           var node = {
                'success' : true,
                'message' : '로그인에 성공하셨습니다',
                'redirectURL' : '/login/login_success'
               }
              res.send(node);
	});
	
	router.get('/login_success', ensureAuthenticated, function(req, res){
		clog.info("로그인에 성공 하였습니다.2");
	    clog.info(req.user);
	    res.redirect('/');
	   // res.render('users', { user: req.user });
	});
	
	function ensureAuthenticated(req, res, next) {
	    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
	    if (req.isAuthenticated()) { return next(); }
	    // 로그인이 안되어 있으면, login 페이지로 진행
	    res.redirect('/login');
	}

	///2. facebook login
	router.get('/facebook',
	  passport.authenticate('facebook',
	    {scope:['email']}
	));

	router.get('/facebook/return', 
	  passport.authenticate('facebook', 
	  { 
	    successRedirect: '/facebook/route',
	    failureRedirect: '/main' 
	  }
	));

	router.get('/facebook/route',function(req,res){

		if(req.user.phonenumber)
		{
			clog.info("페이스북 로그인 사용자입니다 : "+req.user);
			clog.info("facebook route... ...success");
			res.redirect('/main');
		}
		else
		{
			clog.info("facebook route... ...fail to regist")
			res.redirect('/join_f')
		}
	
	});

	///3. kakao login
	router.get("/kakao", passport.authenticate('kakao',{state: "myStateValue"}));

	router.get("/oauth", passport.authenticate('kakao',
	  {
	    successRedirect : '/kakao/route',
	    failureRedirect : '/main'
	  }), function(req, res){
	    // 로그인 시작시 state 값을 받을 수 있음
	    res.send("state :" + req.user.username);
	});

	router.get('/kakao/route',function(req,res){
		if(req.user.phonenumber)
		{
			clog.info("카카오 로그인 사용자입니다 : "+req.user.displayName);
			clog.info("kakao route... ...success");
			res.redirect('/main');
		}
		else
		{
			clog.info("kakao route... ...fail to regist")
			res.redirect('/join_k')
		}
	});
	///////////////////////////////////////////

	////////////////로그아웃 하기///////////////
	
	router.get('/logout', function(req, res){

	  req.logout();
	  res.redirect('/login');

	});

	///////////////////////////////////////////


	////////////////패스워드 찾기///////////////

	router.get('/findPassword',function(req,res){
		res.render('password');
	})

	///////////////////////////////////////////



export default router
