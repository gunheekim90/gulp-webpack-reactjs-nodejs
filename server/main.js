import express from 'express';
import articles from './routes/articles';


const app = express();
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

app.get('/',(req,res) =>{

	res.render('index',{user: 'sex'});

})

app.get('/hello',(req,res) =>{

	return res.send('Can you hear me?');
});

app.use('/articles',articles);

const server = app.listen(3000, () =>{
	console.log('Express listening on port 3000');
});


