# Web Workers (browser JavaScript threads)

JavaScript running in the browser or server in Node.js uses a single processing thread. This can be inefficient:

* it does not matter how many cores the PCs processor has since only one can be used.
* long-running calculations can cause all processing to halt. A browser may show an "unresponsive script" error or a server will not process requests from other users.


Browsers provide [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers); a JavaScript file which runs in another processing thread. Workers are intentionally limited:

* The worker cannot access the DOM. It can use some `window` properties, web sockets, and IndexDB but, in most cases, it is used for long-running calculations, e.g. creating or modifying an image.
* The main and worker processes can only communicate by sending string messages (which could be a JSON-encoded object).
* A worker can spawn other workers if necessary.


## Dedicated Web Workers

A dedicated worker is only accessible from the script that launched it. Worker support can be detected by checking for `window.Worker` before launching:

```js
// main.js
let myWorker;
if (window.Worker) {
  myWorker = new Worker('myworker.js')
}
```

The main script can then post a message to the worker. This must be a single value, but can be an object or array:

```js
myWorker.postMessage('Hello!');
```

The worker script (`myworker.js`) receives an `onmessage` event with an object that has a single `data` property. It can do some processing and post another message back:

```js
// myworker.js
onmessage = e => {

  console.log('worker received:', e.data); // worker received: Hello!
  postMessage(e.data.length); // post string length

};
```

The main script has a similar `onmessage` event attached to the `myWorker` object:

```js
// main.js
myWorker.onmessage = e => {
  console.log('main received:', e.data); // main received: 6
};
```

The main script can terminate the worker at any time using `myWorker.terminate()`. The worker can terminate itself using `close()`.

If the worker raises an error, an `onerror` event is raised with an error object:

```js
// main.js
myWorker.onerror = e => {
  console.log('error message:', e.message);
  console.log('worker filename:', e.filename);
  console.log('line number:', e.lineno);
};
```

Worker threads can import libraries and other code using `importScripts()`, e.g.

```js
// worker.js
importScripts('one.js');                 /* imports one.js */
importScripts('one.js', 'two.js');       /* imports two scripts */
importScripts('//example.com/three.js'); /* import scripts from other origins */
```

Scripts can be downloaded in any order but will execute synchronously.


## Shared web workers

A shared worker is a single script which can be accessed by multiple scripts in different windows, tabs, iframes or other workers.

A shared worker communicates with multiple main threads using ports to ensure messages are sent and received correctly.

Shared workers are not supported by IE or Safari which makes them a little impractical. I've not encountered a reason to use one yet!

[Refer to MDN for further shared web worker information](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).


## Service workers

[Service workers](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker) are a special type of worker used by Progressive Web Apps. They are effectively network proxies which intercept all HTTP requests and can then:

1. allow the request to continue
1. return a previously-cached response so the site can continue to run when offline, or
1. return any other response, e.g. a specific image or JSON file.

Service worker scripts must be served over HTTPS from the same domain and a parent path of the page being accessed.

[Refer to MDN for further PWA information](https://developer.mozilla.org/en-US/docs/Web/Apps/Progressive).
