const lib = (() => {

  'use strict';

  let count = 0;

  function asyncInc(callback) {

    // stop count at 1 or above
    if (count > 0) {
      process.nextTick(() => callback(count));

      /*
        DON'T FORGET TO RETURN!
        This prevents the following code running.
        Without it, the callback is called twice on the second run.
      */
      return;
    }

    // increase count
    count++;

    // return after half a second
    setTimeout(() => callback(count), 500);

  }

  return { asyncInc: asyncInc };

})();


lib.asyncInc(n1 => {

  // output: 1
  console.log(n1);

  // output: ?
  lib.asyncInc(n2 => console.log(n2));

});
