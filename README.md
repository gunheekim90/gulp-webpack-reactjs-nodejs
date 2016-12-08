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



