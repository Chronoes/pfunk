import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';

const paths = {
  buildDir: 'dist',
  sourceFiles: 'src/**/*.js',
  testFiles: 'test/**/*.js',
};

gulp.task('build', () =>
  gulp.src(paths.sourceFiles)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.buildDir))
);

gulp.task('lint:source', () =>
  gulp.src(paths.sourceFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('lint:tests', () =>
  gulp.src(paths.testFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('lint', ['lint:source', 'lint:tests']);

gulp.task('watch', () =>
  gulp.watch(paths.sourceFiles, ['lint', 'build'])
);

gulp.task('test', () =>
  gulp.src(paths.testFiles)
    .pipe(mocha({
      compilers: ['js:babel-core/register'],
    }))
);

gulp.task('check', ['lint', 'test', 'build']);

gulp.task('default', ['lint', 'build', 'watch']);
