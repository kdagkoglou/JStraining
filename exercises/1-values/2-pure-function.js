#!/usr/bin/env node

(function() {

  'use strict';

  // TODO: remove all array items which match a value
  // parameters array = [1, 2, 3, 2, 1], match = 2
  // return [1, 3, 1]
  // it must be a pure function which does not change the input array!
  function arrayDeleteValues(array, match) {
    return array.filter(function(element){
      return element !== match;
    });
  }

  // define an array
  var myArray = [0, 1, 2, 3, 4, 3, 2, 1, 0];

  // 9 [0, 1, 2, 3, 4, 3, 2, 1, 0]
  console.log(myArray.length, myArray);

  // remove items matching 2
  var myArrayResult = arrayDeleteValues(myArray, 2);

  // 7 [0, 1, 3, 4, 3, 1, 0]
  console.log(myArrayResult.length, myArrayResult);

  // 9 [0, 1, 2, 3, 4, 3, 2, 1, 0]
  console.log(myArray.length, myArray);

})();
