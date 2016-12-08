Now we gonna make packiging node moduel
first of all, We have to install somw plugin

   *gulp-bale
   
   *gulp-nodemon
   
   *gulp-webpack
   
   *browser-sync
   
   *gulp-file-cache
   
   *babel-loader
   
   
And now we can use ES6 code on script
so. make the router articles.js on /server/router/article.js

	import express from 'express';
	const router = express.Router();

	router.use((req, res, next) => {
			console.log('Time: ', Date.now().toString());
			next();
	});

	router.get('/', (req, res) => {
			res.send('articles');
	});

	router.get('/read/:id', (req, res) => {
			res.send('You are reading article ' + req.params.id);
	});

	export default router;

and make the main.js file on /server/

		import express from 'express';

		const app = express();

		app.use('/', express.static(__dirname + '/../dist'));

		app.get('/hello', (req, res) => {
				return res.send('Can you hear me?');
		});

		import articles from './routes/articles';

		app.use('/articles', articles);

		const server = app.listen(3000, () => {
				console.log('Express listening on port 3000');
		});

also we show change the code to use ES2016 
so we open gulpfile.babel.js and add this code


		const SRC = {
				JS: DIR.SRC + '/js/*.js',
				CSS: DIR.SRC + '/css/*.css',
				HTML: DIR.SRC + '/*.html',
				IMAGES: DIR.SRC + '/images/*',
				SERVER: 'server/**/*.js'
		};

		const DEST = {
				JS: DIR.DEST + '/js',
				CSS: DIR.DEST + '/css',
				HTML: DIR.DEST + '/',
				IMAGES: DIR.DEST + '/images',
				SERVER: 'app'
		};

		 gulp.task('babel', () => {
				return gulp.src(SRC.SERVER)
				.pipe(babel({
						presets: ['es2015']
				}))
				.pipe(gulp.dest(DEST.SERVER));
		});
		
		
But this code something wrong!
if you change the JS code, all the code such as CSS,HTML... change too

so you  ahve to use babel cache plugin

	gulp.task('babel', () => {
			return gulp.src(SRC.SERVER)
						 .pipe(cache.filter())
						 .pipe(babel({
								presets: ['es2015']
						 }))
						 .pipe(cache.cache())
						 .pipe(gulp.dest(DEST.SERVER));
	});
	
** what is the diffrent Webpack Stream VS Gulp-Cache
***It really depends on what you want. If you are going to have everything compiled by webpack using loaders then you have no need for Gulp. However if you want just the JavaScript to be compiled by webpack and the rest of the resources, like CSS, compiled using other Gulp tasks then this would be useful as it allows you to just run one command to build everything.
	
	
and now you can compile the codes by gulp babel

		$ gulp babel

		[16:49:41] Requiring external module babel-register
		[16:49:42] Using gulpfile ~/node_tutorial/gulp-es6-webpack/gulpfile.babel.js
		[16:49:42] Starting 'babel'...
		[16:49:42] Finished 'babel' after 295 ms

		$ gulp babel

		[16:49:45] Requiring external module babel-register
		[16:49:46] Using gulpfile ~/node_tutorial/gulp-es6-webpack/gulpfile.babel.js
		[16:49:46] Starting 'babel'...
		[16:49:46] Finished 'babel' after 53 ms
		
And also you have to set babel watch

    let watcher = {
        js: gulp.watch(SRC.JS, ['js']),
        css: gulp.watch(SRC.CSS, ['css']),
        html: gulp.watch(SRC.HTML, ['html']),
        images: gulp.watch(SRC.IMAGES, ['images']),
        babel: gulp.watch(SRC.SERVER, ['babel'])
    };

And now is the step, use nodemon
It can watch changing code and restart the server

		import nodemon from 'gulp-nodemon'

		gulp.task('start', ['babel'], () => {
				return nodemon({
						script: DEST.SERVER + '/main.js',
						watch: DEST.SERVER
				});
		});

		gulp.task('default', ['clean', 'js', 'css', 'html',
													'images', 'watch', 'start'], () => {
				gutil.log('Gulp is running');
		});
		

And Next we make the webpack enviroment

