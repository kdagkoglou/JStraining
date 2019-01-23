# Node child processes (server JavaScript threads)

JavaScript running in the browser or server in Node.js uses a single processing thread. This can be inefficient:

* it does not matter how many cores the PCs processor has since only one can be used.
* long-running calculations can cause all processing to halt. A browser may show an "unresponsive script" error or a server will not process requests from other users.

Node.js provides several [child process APIs](https://nodejs.org/dist/latest-v10.x/docs/api/child_process.html) for running applications in another thread. This can be useful when:

* a component requires another runtime such as Python, Go or Rust
* a long-running calculation is required
* a child process could be unreliable, risks crashing, or needs to be terminated.

This is especially useful when creating Express.js applications. A forked process can be handled in parallel while serving other users.

Assure uses [child forks](https://nodejs.org/dist/latest-v10.x/docs/api/child_process.html#child_process_child_process_fork_modulepath_args_options) - *which are specifically designed for Node.js JavaScript code* - for two processes:

1. Image hash processing (`lib\util.js`, `imageHash()` method, forks `lib\worker-imagehash.js`). The [jimp image manipulation library](https://www.npmjs.com/package/jimp) is generally reliable but a corrupt image can cause infinite processing loops.
1. Excel report generation (`lib\report-moexport.js`, `run()` method, forks `lib\worker-moexport.js`). Reading and manipulating an Excel file could cause problems, especially if two or more users are attempting an export at the same time.

Like web workers, child processes communicate via posted message strings. Example:

```js
// worker-node.js
const
  fork = require('child_process').fork,
  worker = fork(__dirname + '\\fibonacci-node.js');

// worker timeout after 1 second
let timeout = setTimeout(function() {
  console.log('worker timeout');
  worker.kill();
}, 1000);

// worker returns message
worker.on('message', function(data) {
  console.log('received message from worker:', data);
});

// worker ends
worker.on('close', function() {
  console.log('worker closed');
  if (timeout) clearTimeout(timeout);
  process.exit();
});

// initiate worker
worker.send(50);
```

The `fibonacci-node.js` worker script:

```js
// fibonacci-node.js worker

// new data message - start processing
process.on('message', async num => {

  let result = 0;
  num = Number(num);

  if (!isNaN(num) && num > 0) {
    result = fibonacci(num);
  }

  // fake a processing delay
  await pause(500);

  // send result and end process
  process.send(result, () => { process.exit(); });

});


// end process if main thread disconnects
process.on('disconnect', () => process.exit());


// pause for delay ms
function pause(delay = Math.random() * 1000 + 500) {

  return new Promise(resolve => {
    setTimeout(() => { resolve(true); }, delay);
  });

}


// fibonacci calculation
function fibonacci(num) {

  let a = 1, b = 0;

  while (num) {
    let t = a;
    a += b;
    b = t;
    num--;
  }

  return b;

}
```

