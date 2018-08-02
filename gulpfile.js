let gulp =        require('gulp');
let pug =         require('gulp-pug');
let clean =       require('gulp-clean');
let sass =        require('gulp-sass');
let browserify =  require('browserify');
let source =      require('vinyl-source-stream');
let tsify =       require('tsify');
let watchify =    require("watchify");
let gutil =       require('gulp-util');
let buffer =      require('vinyl-buffer');
let sourcemaps =  require('gulp-sourcemaps');
let uglify =      require('gulp-uglify');

let conf = {
  appName: 'app/',
  appFolder: `./app/`,
  buildFolder: './dist/',
  prod: true
}

gulp.task('clean', () =>
  gulp.src(conf.buildFolder)
    .pipe(clean())
);

gulp.task( 'sass-compile', () =>
  gulp.src(`${conf.appFolder}*.sass`)
    .pipe(sass({outputStyle: conf.prod ? 'compressed': ''}))
    .pipe(gulp.dest(`${conf.buildFolder}${conf.appName}`))
);

gulp.task('pug-compile', () =>
  gulp.src(`${conf.appFolder}*.pug`)
    .pipe(pug())
    .pipe(gulp.dest(`${conf.buildFolder}${conf.appName}`))
);

let watchedBrowserify = watchify(browserify({
    basedir: './app/',
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
  .pipe(gulp.dest(`${conf.buildFolder}${conf.appName}`))
}

gulp.task('build', ['pug-compile', 'sass-compile']);

gulp.task('watch', () => {
  gulp.watch(`${conf.appFolder}**/*.sass`, ['sass-compile']);
  gulp.watch(`${conf.appFolder}**/*.pug`, ['pug-compile']);
});


gulp.task( 'default', ['build', 'watch'], bundle);