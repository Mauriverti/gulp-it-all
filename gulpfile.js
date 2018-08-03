let argv =        require('yargs').argv;            // Helps to get adicional paramethers from terminal
let browserify =  require('browserify');            // Enables the import/require function in browsers
let buffer =      require('vinyl-buffer');          // Converts streaming vinyl files to use buffers
let clean =       require('gulp-clean');            // Removes folders
let conf =        require('./package.json');        // Loads project paramethers
let gulp =        require('gulp');                  // automates tasks
let gutil =       require('gulp-util');             // Utility functions for gulp plugins
let pug =         require('gulp-pug');              // Compiles pug files
let sass =        require('gulp-sass');             // Compiles sass files
let source =      require('vinyl-source-stream');   // Avoids the needs of browserify-based libs and their overhead over browserify lib
let sourcemaps =  require('gulp-sourcemaps');       // Creates sourcemaps to uglyfied files
let tsify =       require('tsify');                 // Browserify plugin for compiling TypeScript
let uglify =      require('gulp-uglify');           // Minifies files
let watchify =    require("watchify");              // Watch mode for browserify builds
let webserver =   require('gulp-webserver');        // Webserver to test code in developer environment
let zip =         require('gulp-zip');              // Generate a zip from a folder

Object.assign( conf, {
  appFolder: `./app/`,
  buildFolder: './dist/',
  port:       argv.port    || 4500,
  serverIP:   argv.apiHost || 'localhost',
  serverPort: argv.apiPort || 8080,
  serverName: argv.apiName || 'system',
  prod: argv.prod,
});

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

gulp.task('compile', ['pug-compile', 'sass-compile', 'watch', 'preview'], bundle);

gulp.task('preview', () => {
  gulp.src(conf.buildFolder)
    .pipe(webserver({
      livereload: true,
      host: '0.0.0.0',
      port: conf.port,
      https: false,
      directoryListening: true,
      proxies: [{
        source: '/api/',
        target: `http://${conf.serverIP}:${conf.serverPort}/${conf.serverName}/`
      }]
    }))
});

gulp.task('watch', () => {
  gulp.watch(`${conf.appFolder}**/*.sass`, ['sass-compile']);
  gulp.watch(`${conf.appFolder}**/*.pug`, ['pug-compile']);
});

gulp.task('build', () =>
  gulp.src(`${conf.buildFolder}*`)
    .pipe(zip(`${conf.name}#${conf.version}.zip`))
    .pipe(gulp.dest('./'))
);


gulp.task( 'default', ['compile']);