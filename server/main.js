import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import bkfd2Password from 'pbkdf2-password';
import _ from 'underscore';
const hasher = bkfd2Password();
const port = process.env.PORT || 3000
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
import mysql from 'mysql';

import db from './db.js';
import articles from './routes/articles';
import login from './routes/login';
import myFunc from './config/passport';
myFunc(passport);

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')(
	{ 
		secret: 'keyboard cat',
	  	resave: true,
	  	saveUninitialized: true,
	  	cookie: {
   			 maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
  		} 
	}
));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res) =>{

	res.render('index',{user: 'sex'});

})

app.get('/hello',(req,res) =>{

	return res.send('Can you hear me?');
});

//require('./routes/registerRoutes.js')(app,passport);
// require('./routes/aboutRoutes.js')(app);
app.use('/articles',articles);
app.use('/login',login);

db.sequelize.sync({force : false}).then(() =>{
	 app.listen(port, () =>{
	console.log('Express listening on port'+port);
 });
})


