import gulp from 'gulp';

import pug from 'gulp-pug';
import gulpPugBeautify from 'gulp-pug-beautify';

import gulpSass from 'gulp-sass';
import dartSass from 'sass';

import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';

import uglify from 'gulp-uglify';

import imagemin from 'gulp-imagemin';

import svgSprite from 'gulp-svg-sprite';
import cheerio from 'gulp-cheerio';
import svgmin from 'gulp-svgmin';

import browserSync from 'browser-sync';

import plumber from 'gulp-plumber';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import concat from 'gulp-concat';

import gutil from 'gulp-util';
import ftp from 'vinyl-ftp';

import { deleteAsync } from 'del';

const sass = gulpSass(dartSass);

// paths
const paths = {
  dirs: {
    dist: './dist',
  },

  html: {
    src: ['./src/template/pages/*.pug', './src/template/elements/*.pug'],
    // src: './src/template/pages/*.pug',
    dest: './dist',
    watch: [
      './src/template/pages/*.pug',
      './src/template/blocks/**/*.pug',
      './src/template/layouts/*.pug',
      './src/template/elements/*.pug',
      './src/template/mixins/*.pug',
    ],
  },

  css: {
    src: './src/styles/styles.sass',
    dest: './dist/css',
    watch: [
      './src/template/blocks/**/*.sass',
      './src/styles/**/*.sass',
      './src/styles/*.sass',
    ],
  },

  libs: {
    src: ['./src/libs/**/*.js'],
    dest: './dist/js',
    watch: './src/libs/**/*.js',
  },

  js: {
    src: './src/js/*.js',
    dest: './dist/js',
    watch: './src/js/*.js',
  },

  php: {
    src: './src/template/pages/*.php',
    dest: './dist/',
    watch: './src/template/pages/*.php',
  },

  images: {
    src: ['./src/img/*', './src/img/*/*'],
    dest: './dist/img',
    watch: ['./src/img/*'],
  },

  sprites: {
    src: './src/img/*.svg',
    dest: './src/img',
    watch: ['./src/img/*.svg'],
  },

  fonts: {
    src: './src/fonts/**/*',
    dest: './dist/fonts',
    watch: './src/fonts',
  },

  deploy: {
    src: './dist/**',
  },
};

// pug
gulp.task('pug', function () {
  return gulp
    .src(paths.html.src)
    .pipe(plumber())
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(
      gulpPugBeautify({
        omit_empty: true,
        fill_tab: true,
        tab_size: 4,
      })
    )
    .pipe(gulp.dest(paths.html.dest))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// styles
gulp.task('styles', function () {
  return gulp
    .src(paths.css.src)
    .pipe(plumber())
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(sourcemaps.init())
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// js
gulp.task('js', function () {
  return gulp
    .src(paths.js.src)
    .pipe(plumber())
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// js libs
gulp.task('libs', function () {
  return gulp
    .src(paths.libs.src)
    .pipe(plumber())
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.libs.dest));
});

// php
gulp.task('php', function () {
  return gulp
    .src(paths.php.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.php.dest))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// images
gulp.task('images', function () {
  return (
    gulp
      .src(paths.images.src)
      .pipe(plumber())
      // .pipe(imagemin({
      // 	verbose: true,
      // }))
      .pipe(gulp.dest(paths.images.dest))
  );
});

// svg sprite
gulp.task('sprites', function () {
  return gulp
    .src(paths.sprites.src)
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: 'sprite/',
            render: {
              scss: {
                dest: '../../../src/styles/sprite.scss',
                template: 'src/styles/_mixins/_sprite.scss',
              },
            },
          },
        },
      })
    )
    .pipe(gulp.dest(paths.sprites.dest));
});

// fonts
gulp.task('fonts', function () {
  return gulp
    .src(paths.fonts.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// deploy
gulp.task('deploy', function () {
  const hosting = ftp.create({
    host: 'hostname',
    user: 'username',
    password: 'userpassword',
    parallel: 10,
    log: gutil.log,
  });
  return gulp
    .src(paths.deploy.src)
    .pipe(hosting.newer('path.to.hosting.folder')) // upload new files
    .pipe(hosting.dest('path.to.hosting.folder')); // upload all files
});

// server
gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: paths.dirs.dist,
    },
    reloadOnRestart: true,
  });

  gulp.watch(paths.html.watch, gulp.parallel('pug'));
  gulp.watch(paths.css.watch, gulp.parallel('styles'));
  gulp.watch(paths.libs.watch, gulp.parallel('libs'));
  gulp.watch(paths.js.watch, gulp.parallel('js'));
  gulp.watch(paths.php.watch, gulp.parallel('php'));
  gulp.watch(paths.images.watch, gulp.parallel('images'));
  gulp.watch(paths.sprites.watch, gulp.parallel('sprites'));
  gulp.watch(paths.fonts.watch, gulp.parallel('fonts'));
});

// clean
gulp.task('clean', function () {
  return deleteAsync(paths.dirs.dist);
});

// build
gulp.task(
  'build',
  gulp.series(
    'clean',
    'sprites',
    'pug',
    'styles',
    'libs',
    'js',
    'php',
    'images',
    'fonts'
  )
);

gulp.task('dev', gulp.series('build', 'server'));
