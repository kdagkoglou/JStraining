# localStorage and sessionStorage

If a state value need only be accessible on the client, [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) may be a better option than cookies. Typical use-cases may be UI states, temporary values, etc.

The [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) is extends the `window` object so support can be tested, e.g.

```js
if (window.localStorage) {
  // store stuff locally
}
```

Web Storage is specific to a domain and two types are available:

* `localStorage` - data is stored indefinitely between browser restarts
* `sessionStorage` - data is stored temporarily until the page session ends.

Both have identical methods to store name and value pairs - `localStorage` is used in examples below.


## Basic usage

Set a value:

```js
localStorage.setItem('name1', 'value1');
```

All values are stored as strings. This is not necessarily a problem for numbers, but booleans, objects and arrays should be encoded using JSON or similar before storing.

Get a value:

```js
let name1 = localStorage.getItem('name1');
```

Remove a single item:

```js
localStorage.removeItem('name1');
```

Clear all items:

```js
localStorage.clear();
```

## Storage event

A window storage event is raised when a name/value pair is changed. This can be used to signal other browser tabs running the same application:

```js
window.addEventListener('storage', function(e) {
  /*
    e.key - the key name being changed
    e.oldValue - the key's old value (null for new keys)
    e.newValue - the key's new value
    e.url - the URL of the page where the value was changed
    e.storageArea - the Storage object, either localStorage or sessionStorage
  */
});
```


## Performance and security

Web storage is typically capped at 5MB in most browsers although limits can vary. Recent editions of Safari can crash if you attempt to store too much data.

Unlike cookies, storage is saved to the local disk rather than being sent across the network on every request. This has security benefits, but you should still avoid storing personal data which can be accessed via browser tools or injected third-party JavaScript.

Browser support is excellent (IE8+), but the API is synchronous so it will block DOM updates while values are set and retrieved from disk (even an animated GIF will pause). If many rapid updates are required, it may be preferable to use an in-memory state variable which is written to localStorage when the page is unloaded.

Web storage access is not possible from a web worker so all data must be passed accordingly.


## Alternative storage options

[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) is a transactional database system which lets you store and retrieve objects indexed with a key. It has [good browser support](https://caniuse.com/#feat=indexeddb) and higher storage limits of around 50MB. However, it is more complex to use and the API is synchronous so it blocks DOM updates. Perhaps best-used for single-page applications which will never save data to a server.

Progressive Web Apps use service workers to store the result of HTTP requests or other data in [Cache API storage](https://developer.mozilla.org/en-US/docs/Web/API/Cache). [Browser support is good](https://caniuse.com/#feat=serviceworkers) and, in theory, the cache could be used by any system to store many megabytes of textual and binary data.

WebSQL is a method used to access local SQLite databases. It was only [implemented in Chrome and Safari](https://caniuse.com/#feat=sql-storage) and was dropped as a web standard. Avoid.

Finally, various [File APIs](https://caniuse.com/#search=file) allow browsers to open files, read data, and re-save. This is only likely to be practical for applications which manipulate files such as images or PDFs.


## Exercises

Adapt the Ajax quiz to use localStorage so:

1. Previously-asked questions are avoided.
1. Previous scores are retained.
