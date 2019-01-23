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
