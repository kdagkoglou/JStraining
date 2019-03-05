# Gulp.js build system

[Gulp.js](https://gulpjs.com/) is a generic Node.js build system. Assure uses Gulp 4, but earlier releases use Gulp 3.

In general, Gulp is used to:

1. Optimise all assets at build time. For example, all DoT templates require a header and a footer - these are added during the build rather than at runtime.
1. Make development easier. For example, assets are optmised as they are created and live reloading is implemented.


## Build files

All source files are contained in `/src`.

Most static assets are built to `/static`. This is declared as a static folder in express.js so file URLs can be referenced directly.

HTML DoT templates are built to `/views`.

The `static` and `views` folders can be wiped with `gulp clean`.


## Gulp tasks

Task functions are available to optimised static assets:

1. HTML templates: file includes, SVG includes, and common strings (such as the application name) are rendered at build time to create DoT templates.
1. Image compression.
1. Sass compilation. In some cases, images are embedded into the CSS file - this is primarily for SVGs.
1. JavaScript processing. Includes preprocessing order and strings, plus debug stripping, concatenation and minification.
1. Static asset move to build folder. Includes fonts, favicon, and manifest.


Each task can be run separately, e.g. `gulp css` to build CSS assets (which also copies required images and fonts).

However, in most cases, you will:

* build assets prior to launch using `gulp build` (or `gulp run`), or
* launch `gulp` which runs Assure in development mode which watches for file changes and rebuilds incrementally.

Two further processes run in development mode (when `NODE_ENV` is NOT `production`):

1. `nodemon` - this restarts `app.js` when a change is made to any application file
1. `browsersync` - this implements a proxy server which auto-loads assets on change. Only CSS is reloaded on change.


## How Gulp.js works

Gulp defines tasks in `gulpfile.js` and requires plugins to do anything useful. Each task is a function which normally returns a Gulp stream (although Promises, event emitters, child processes, observables, and callbacks are also supported). A stream typically loads one or more files, pipes the data through one or more plugins, and outputs to another location. Example image processor:

```js
function images() {

  return gulp.src('src/images/**/*')          // get all source images in all sub-folders
    .pipe(newer('static/images/'))            // remove those already in build folder
    .pipe(imagemin({ optimizationLevel: 5 })) // optimise remaining images
    .pipe(gulp.dest('static/images/'));       // output to build folder

}
```

The task can be used once it has been exported:

```js
exports.images = images;
```

The command `gulp images` now runs the function and optimises images.

Tasks can also be run in series - one at a time - if dependencies are required, e.g.

```js
// build images, build fonts, build CSS in order
exports.css = gulp.series(images, fonts, css);
```

or in parallel, e.g.

```js
exports.build = gulp.parallel(css, js, html);
```

or a combination of both:

```js
exports.build = gulp.parallel(gulp.series(images, fonts, css), js, html);
```
