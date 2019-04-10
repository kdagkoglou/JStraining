# Source files

All source files are contained in `/src`.

Most static assets are built to `/static`. This is declared as a static folder in Express.js so file URLs can be referenced directly.

HTML DoT templates are built to `/views`.

The `static` and `views` folders can be wiped with `gulp clean`. This is generally unnecessary unless source files have been removed or renamed.


## Images

Images are optimised to minimise file sizes. Only newer images are processed.

|type|description|
|-|-|
|source files|`src/images/**/*`|
|destination|`static/images/`|
|Gulp task|`gulp images`|


## Font (webicons)

Most icons are stored in a single font file. While webicon fonts have recently fallen from favour for SVGs, a single set of around 100 icons has been defined which is moved to an appropriate folder.

The font files are referenced in `src/scss/base/_webfont.scss` using the `resolve()` declaration which is parsed by the PostCSS assets plugin.

|type|description|
|-|-|
|source files|`src/fonts/**/*`|
|destination|`static/fonts/`|
|Gulp task|`gulp fonts`|


## Root files

The `favicon.icon` and `manifest.json` files are copied to the `static` root with no modification.

|type|description|
|-|-|
|source files|`src/*`|
|destination|`static/`|
|Gulp task|`gulp rootfile`|


## CSS (Sass and PostCSS)

Three primary CSS files are created from Sass `.scss` files:

* `main.scss` - the primary application styles
* `testmedia.scss` - the exported test styles which are embedded directly into the HTML ([example](https://empello.net/test/5c8a6143720f0c446eba16da/media/))
* `export.scss` - the exported report styles embedded directly into the HTML

Further PostCSS plugins then resolve/inline file assets, append prefixes, merge responsive declaration blocks, and minify the resulting code.

|type|description|
|-|-|
|source files|`src/scss/*`|
|destination|`static/css/`|
|Gulp task|`gulp css`|

The `images` and `fonts` tasks are automatically run prior to the `css` task to ensure assets are available to be referenced in the resulting CSS.

General points:

* CSS functionality and animations are preferred over JavaScript.
* font, colours and responsive breakpoint variables are defined in `src/scss/helpers/_variables.scss`
* a few margin and responsive breakpoint mixins are defined in `src/scss/helpers/_mixins.scss`
* the base styles are defined in `src/scss/base` - most styles inherit from these
* components such as the media view and model dialog are contained in separate files in `src/scss/components`
* page-specific styles are defined in `src/scss/pages`
* the theme is controlled by `src/scss/helpers/_themes.scss`. This defines all colours which are passed as Sass variables (better client-side methods may be practical now).
* a few SVGs are embedded directly into the CSS but base64 bitmaps are avoided (they add a download and processing overhead)
* further styles for the exported report are contained in `src/scss/export`

Mobile-first methodology is used: the default layout is linear with further columns permitted when the device has space.

CSS Flexbox is used for cards on the dashboard and some reports. This has good support from IE10 so no fallbacks are required.

Only the Ad Scanner report and exported tests use CSS Grid. An `inline-block` fallback is defined for older browsers (`-ms-grid` is not used).

A sourcemap is appended to the CSS file in development mode.


## HTML views

Where possible, HTML views are rendered at build time to include partials, add static strings (such as the application name), add components, etc.

|type|description|
|-|-|
|source files|`src/html/*`|
|destination|`views`|
|Gulp task|`gulp html`|

The `css` task is automatically run prior to the `html` task to ensure assets are available to be referenced in the resulting views.

The `gulp-preprocess` plugin:

* substitutes known strings
* includes files from the `src/html/template` folder such as headers, footers, menus, etc.
* runs mixin-like functions defined in `src/html/lib/lib.js`.

The resulting code is minified in production mode.

General notes:

* several `test-` views are defined for administration, read-only, and exported tests
* files starting `help-` are help files (all currently end in `-en` for English)
* most reports are controlled by the `report-generic.dot` view


## Client-side JavaScript

Progressive Enhancement is implemented with JavaScript components defined in separate `.js` files. ES5 is mostly used to maximize browser compatibility.

|type|description|
|-|-|
|source files|`src/js/*`|
|destination|`static/js/`|
|Gulp task|`gulp js`|

The build process can copy and link to each file separately. This was originally implemented to aid debugging, but concatenation, minification, and sourcemaps are now used.

Other points:

* fast vanilla JavaScript is used: no third-party frameworks have been added
* script dependency order is determined using the `gulp-deporder` plugin. This examines comments at the top of the code, e.g. `// requires: lib.js`.
* application variables such as the version number are embedded into code using the `gulp-preprocess` plugin.
* `console` and `debugger` statements are automatically removed in production mode using the `gulp-strip-debug` plugin.

Scripts:

|script|description|
|-|-|
|`config.js`|global configuration variables|
|`lib.js`|helper functions|
|`shim-template.js`|HTML5 template shim for older browsers|
|`autocomplete.js`|generic auto-complete for HTML5 datalists|
|`card-load.js`|card scroll/load display (used by Ad Scanner only)|
|`copyable.js`|copies fields to the clipboard when the label is clicked|
|`file-drop.js`|file drag and drop (used on tests only)|
|`form.js`|generic form handler, handles toggles, opens links, etc.|
|`form-change.js`|check if a form has changed so user can be warned before navigating away|
|`map.js`|dashboard map functionality such as hover boxes|
|`media-preview.js`|image preview (used on tests and Ad Scanner)|
|`report-link.js`|controls report tables which can be clicked to access test lists|
|`scrollto.js`|smoothly scrolls to an `#target` anchor when clicked|
|`selectcolor.js`|changes a `select` dropdown background colour (for status)|
|`table.js`|controls table pagination, clicking and history|
|`test-autofill.js`|data auto-fill for known landing pages|
|`test-company.js`|add and remove companies from a test|
|`test-issue.js`|test issue functionality such as linking, removal, status change, etc.|
|`test-list.js`|changes filters on test list, e.g. reset dates when 28-days is chosen|
|`test-network.js`|auto-selects a network when its company is entered on a test|
|`test-process.js`|changes Guardian tests to "Guardian + manual" when files are added to a test|
|`textarea.js`|changes the height of `textarea` elements according to content|
|`toggler.js`|generic toggle state; stores in localStorage and applies class to HTML `body`|
|`zAnalytics.js`|Google Analytics (`z` prefix to place last)|
