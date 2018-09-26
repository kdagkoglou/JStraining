# Advanced DOM manipulation
Sometimes it will be necessary to add, modify or remove elements within the DOM.

## DOM manipulation methods
The main methods include (there are many, many more!):

* [`.appendChild()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)
* [`.insertBefore()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore)
* [`.cloneNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode)
* [`.removeChild()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild)
* [`.replaceChild()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild)
* [`.innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
* [`.outerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML)

Use `document.createElement([name])` to create a new element node in memory which can then be appended to the DOM.

Note that all nodes in the document are unique so a single node cannot exist in two places at once. For example, if you get a node then attempt to append it as a child elsewhere, the node is moved - *not copied*.


## Document fragments
Adding individual nodes to the DOM one at a time can be expensive. It is usually better to construct a document fragment in memory then append it to the DOM when ready, e.g.

```html
// new fragment
let frag = document.createDocumentFragment();

// append a DIV to the fragment (div now references that node)
let div = frag.appendChild( document.createElement('div') );

// set the DIV text
div.textContent = 'my new element';

// add the fragment to the body
document.body.appendChild(frag);

```


## HTML5 `<template>` tag
Segments of your HTML page can be marked as a [template](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) which allow it to be used multiple times within a page. See:

https://jsfiddle.net/craigbuckler/od0r1u7p/

This only works in recent browsers and not IE. However, a polyfill and style is used to apply backward compatibility.
