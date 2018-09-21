#!/usr/bin/env node

(function() {

  'use strict';

  // define an array
  var myArray = [0, 1, 2, 3, 4];

  console.log(myArray.length, myArray);

  // TODO: remove the item at index 2
  // hint - perhaps slice it up!
  var myArray2 = myArray.slice();
  myArray2.splice(2,1);

  // should be 4 [0, 1, 3, 4]
  console.log(myArray2.length, myArray2);
  console.log(myArray.length, myArray);

})();
