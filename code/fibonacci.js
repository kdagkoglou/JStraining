// web worker to calculate fibonacci number at an index

// worker receives a message from the main thread
let cNum, cVal;

onmessage = e => {

  let num = Number(e.data);

  if (isNaN(num)) {
    console.log('error');
    postMessage('');
  }
  else if (num === cNum) {
    console.log('cached value', num);
    postMessage(cVal);
  }
  else {
    console.log('calculate new', num);
    cNum = num;
    cVal = fibonacci(num);
    postMessage(cVal);
  }

};


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
