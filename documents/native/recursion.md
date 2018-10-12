# Recursion

A recursive function is one that calls itself. This typically occurs when an item has child items, i.e. an object, tree structure, or DOM document.

Recursion works because the current state of the function is retained on the stack. Each execution of the function is isolated from others.

Recursive functions break a large problem into smaller parts and are very powerful. For example, this program outputs all name/value pairs from an object which can have deeply nested objects or arrays:

```js
const obj = {
  a: 1,
  b: 2,
  c: [
    { d: 4, e: 5 },
    [
      { f: 6 },
      { g: 7 }
    ],
    { h: 8 }
  ],
  i: 9
};

// parse object recursively
recurse(obj);

// output single name and value pairs
function recurse(o) {

  for (let p in o) {
    if (typeof o[p] === 'object') recurse( o[p] );
    else console.log(p, '=', o[p]);
  }

}
```

The result:

```bash
a = 1
b = 2
d = 4
e = 5
f = 6
g = 7
h = 8
i = 9
```
