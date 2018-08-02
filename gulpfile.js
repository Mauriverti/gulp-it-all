let gulp =        require('gulp');
let pug =         require('gulp-pug');
let clean =       require('gulp-clean');
let sass =        require('gulp-sass');
let ts =          require('gulp-typescript');
let tsProject =   ts.createProject('tsconfig.json');
let browserify =  require('browserify');
var source = require('vinyl-source-stream');
let tsify =       require('tsify');

// let appName = 'app/';
// let appFolder = `./${appName}`;
// let buildFolder = './dist/';
// let prod = true;

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

gulp.task('ts-compile', () =>
  tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(gulp.dest(`${conf.buildFolder}${conf.appName}`))
);

gulp.task('deploy', ['build'], () => 
  browserify({
    basedir: './app/',
    entries: ['main.ts'],
    cache: {},
    packageCache: {}
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('main.js'))
  .pipe(gulp.dest(`${conf.buildFolder}${conf.appName}`))
);

gulp.task('build', ['pug-compile', 'sass-compile']);

gulp.task('watch', () => {
  gulp.watch(`${conf.appFolder}**/*.sass`, ['sass-compile']);
  gulp.watch(`${conf.appFolder}**/*.pug`, ['pug-compile']);
  gulp.watch(`${conf.appFolder}**/*.ts`, ['ts-compile']);
});


gulp.task( 'default', ['deploy']);