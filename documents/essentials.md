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


## Arrays
An ordered collection of data. Arrays always have a zero index and can hold any values.


```js
var myArrayA = new Array();
myArray[0] = 1;

var myArrayB = [1, 'two', 3];

myArrayB[0]; // 1
```

Array items can be removed with `delete` but this sets their value to `undefined` - *the array length is not changed*.


## Objects
Objects in JS use a prototypal inheritance model - there is no need to define a `class` (template). Most often, objects are defined on the fly:

```
var objA = {
  name1: 'value',
  name2: 2
};
```

*Further object tutorials are coming!*


## Comparisons
In general, it's better to use `===` or `!==` comparisons:

* `A === B` type and value must match, e.g. `1 === '1'` is false
* `A == B` values must match, e.g. `1 == '1'` is true


## Pure/immutable functions
A pure function is one that, given the same parameters, will always return the same result:

1. It does not change the input parameters.
1. It is not affected by external factors.

This permits reliable testing and can make code easier to understand. That said, it's not always possible or practical!


## Functions are values in JavaScript
Example:

```js
function op(fn, a, b) {
  return fn(a,b);
}

// pass a reference to another function defined inline
op(function(x,y) { return x + y } , 1, 2); // 3

// shorter E6 syntax
op((x,y) => x + y, 1, 2); // 3

```


## Hoisting
Variables and functions declared at the end of code are hoisted (moved) to the top so they can be referenced, e.g.

```js
runMe(); // works

function runMe() {
  console.log('I\'ve been run!');
}
```

But be wary when using variables which are not set until later:

```js
runMe(); // fails

const runMe = function() {
  console.log('I\'ve been run!');
}
```

In this case, the variable `runMe` is hoisted to ensure it's declared, but it has not been set to a value when `runMe()` is called.


## Function parameters

**Passing by value:** a *copy* of a value is passed to a function. It can be manipulated in any way without affecting the original.

```js

function inc(arg) {
  arg++;
  return arg;
}

let a = 1;
console.log( inc(a) ); // 2
console.log(a); // a is 1

a = inc(a); // a is 2
```


**Passing by reference:** the actual value is passed to a function. If it's changed, the original value is changed.

```javascript
function inc(arg) {
  arg.counter++;
  return arg;
}

let a = {
  counter: 1
};

inc(a);
console.log( a.counter ); // a.counter is 2
```


**IMPORTANT!** When passing arguments to JavaScript functions:

1. Native values such as strings, numbers, booleans, etc. are passed by VALUE.
1. Anything else, including objects and arrays are passed by REFERENCE.
