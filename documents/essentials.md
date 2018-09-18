# JavaScript notes

ES6 will be shown, but warnings will be given with ES5 alternatives where necessary. Code converters such as Babel will not be used.

## Learn HTML and CSS first!

1. JavaScript is the most fragile front-end technology.
1. Only use JavaScript when there is no other alternative.
1. Use JavaScript to progressively enhance functionality.

Examples:

* Form fields and validation should be HTML.
* Hover effects, basic animations, scroll-snapping, etc. are better handled in CSS.

[MDN](https://developer.mozilla.org/) is your friend!


## Strict mode
Add this to the top of functions:

```js
'use strict';
```

This switches JS into strict mode and provides improved debugging.

Be wary about setting globally. All code would be placed into strict mode which could cause third-party libraries to break.
