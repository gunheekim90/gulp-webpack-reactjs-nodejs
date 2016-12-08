# format-module-node
To build node easily with gulp,babel,webpack,react

Follow under the direction to make enviroment

$ sudo install npm 

$ sudo npm install -g gulp

$ npm init

$ npm install -save-dev gulp gulp-util

(above the module make the log simply)

$ npm install --save-dev babel-core babel-preset-es2015

(above the module allow us to take using ES^code)


and Lets make the code and file



1. Make .babelrc  file to use ES2015
 {
  "presets": ["es2015"]
 }

2. Make gulpfile.babel. => This file direct the task

    'use strict';

    import gulp from 'gulp';
    import gutil from 'gulp-util';

    gulp.task('default', () => {
        return gutil.log('Gulp is running');
    });
    
3. And then excute '$ gulp'

	[03:18:18] Requiring external module babel-register
	
	[03:18:19] Using gulpfile ~/node_tutorial/gulp-es6-webpack/gulpfile.babel.js
	
	[03:18:19] Starting 'default'...
	
	[03:18:19] Gulp is running
	
	[03:18:19] Finished 'default' after 7.56 ms
	

		 1. gulp.task(name [, deps, fn])
		 2. gulp.src(globs[, options])
		 3. gulp.dest(path[, options])
		 4. gulp.watch(glob[, opts], tasks/cb)
	 
And to use Gulp module we have to install this...
$ npm install --save-dev gulp-uglify gulp-clean-css gulp-htmlmin gulp-imagemin del

Then we have to chage the code in gulpfile...like this

	'use strict';

	import gulp from 'gulp';
	import gutil from 'gulp-util';

	import uglify from 'gulp-uglify';
	import cleanCSS from 'gulp-clean-css';
	import htmlmin from 'gulp-htmlmin';
	import imagemin from 'gulp-imagemin';
	import del from 'del';


	const DIR = {
			SRC: 'src',
			DEST: 'dist'
	};

	const SRC = {
			JS: DIR.SRC + '/js/*.js',
			CSS: DIR.SRC + '/css/*.css',
			HTML: DIR.SRC + '/*.html',
			IMAGES: DIR.SRC + '/images/*'
	};

	const DEST = {
			JS: DIR.DEST + '/js',
			CSS: DIR.DEST + '/css',
			HTML: DIR.DEST + '/',
			IMAGES: DIR.DEST + '/images'
	};

	gulp.task('clean', () => {
			return del.sync([DIR.DEST]);
	});

	gulp.task('js', () => {
			return gulp.src(SRC.JS)
						 .pipe(uglify())
						 .pipe(gulp.dest(DEST.JS));
	}); 


	gulp.task('css', () => {
			return gulp.src(SRC.CSS)
						 .pipe(cleanCSS({compatibility: 'ie8'}))
						 .pipe(gulp.dest(DEST.CSS));
	});

	gulp.task('html', () => {
			return gulp.src(SRC.HTML)
						.pipe(htmlmin({collapseWhitespace: true}))
						.pipe(gulp.dest(DEST.HTML))
	});

	gulp.task('images', () => {
			return gulp.src(SRC.IMAGES)
						 .pipe(imagemin())
						 .pipe(gulp.dest(DEST.IMAGES));
	});

	/*
	gulp.task('watch', () => {
			gulp.watch(SRC.JS, ['js']);
			gulp.watch(SRC.CSS, ['css']);
			gulp.watch(SRC.HTML, ['html']);
			gulp.watch(SRC.IMAGES, ['images']);
	});
	*/

	gulp.task('watch', () => {
    let watcher = {
        js: gulp.watch(SRC.JS, ['js']),
        css: gulp.watch(SRC.CSS, ['css']),
        html: gulp.watch(SRC.HTML, ['html']),
        images: gulp.watch(SRC.IMAGES, ['images'])
    };

    let notify = (event) => {
        gutil.log('File', gutil.colors.yellow(event.path), 'was', gutil.colors.magenta(event.type));
    };

    for(let key in watcher) {
        watcher[key].on('change', notify);
    }

	});

	gulp.task('default', ['clean', 'js', 'css', 'html', 'images', 'watch'], () => {
	    gutil.log('Gulp is running');
	});

Now we setup the enviroment for using node & babel & gulp so far...

When you excute '&gulp', src folder will be clean and rebuild automatically


