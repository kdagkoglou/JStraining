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
