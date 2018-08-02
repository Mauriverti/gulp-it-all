let gulp =        require('gulp');                  // automates tasks
let pug =         require('gulp-pug');              // Compiles pug files
let clean =       require('gulp-clean');            // Removes folders
let sass =        require('gulp-sass');             // Compiles sass files
let browserify =  require('browserify');            // Enables the import/require function in browsers
let source =      require('vinyl-source-stream');   // Avoids the needs of browserify-based libs and their overhead over browserify lib
let tsify =       require('tsify');                 // Browserify plugin for compiling TypeScript
let watchify =    require("watchify");              // Watch mode for browserify builds
let gutil =       require('gulp-util');             // Utility functions for gulp plugins
let buffer =      require('vinyl-buffer');          // Converts streaming vinyl files to use buffers
let sourcemaps =  require('gulp-sourcemaps');       // Creates sourcemaps to uglyfied files
let uglify =      require('gulp-uglify');           // Minifies files
let webserver =   require('gulp-webserver');        // Webserver to test code in developer environment
let argv =        require('yargs').argv;            // Helps to get adicional paramethers from terminal

let conf = {
  appFolder: `./app/`,
  buildFolder: './dist/app/',
  serverIP:   argv.apiHost || 'localhost',
  serverPort: argv.apiPort || 8080,
  serverName: argv.apiName || 'system',
  prod: argv.prod,
}

gulp.task('clean', () =>
  gulp.src(conf.buildFolder)
    .pipe(clean())
);

gulp.task( 'sass-compile', () =>
  gulp.src(`${conf.appFolder}*.sass`)
  .pipe(sass({outputStyle: conf.prod ? 'compressed': ''}))
  .pipe(gulp.dest(conf.buildFolder))
);

gulp.task('pug-compile', () =>
  gulp.src(`${conf.appFolder}*.pug`)
    .pipe(pug())
    .pipe(gulp.dest(conf.buildFolder))
);

let watchedBrowserify = watchify(browserify({
    basedir: conf.appFolder,
    entries: ['main.ts'],
    cache: {},
    packageCache: {}
  }))
  .plugin(tsify);

watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', gutil.log);   // useful??

function bundle () {
  return watchedBrowserify
  .bundle()
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(conf.buildFolder))
}

gulp.task('build', ['pug-compile', 'sass-compile', 'watch'], bundle);

gulp.task('webserver', () => {
  gulp.src(conf.buildFolder)
    .pipe(webserver({
      livereload: true,
      host: '0.0.0.0',
      port: 4500,
      https: false,
      directoryListening: true,
      proxies: [{
        source: '/api',
        target: `http://${conf.serverIP}:${conf.serverPort}/${conf.serverName}`
      }]
    }))
});

gulp.task('watch', () => {
  gulp.watch(`${conf.appFolder}**/*.sass`, ['sass-compile']);
  gulp.watch(`${conf.appFolder}**/*.pug`, ['pug-compile']);
});


gulp.task( 'default', ['build', 'webserver']);