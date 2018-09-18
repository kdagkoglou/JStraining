#!/usr/bin/env node

(function() {

  'use strict';

  // TODO: research truthy and falsy in JavaScript
  // write a function that accepts two values (they won't be arrays or objects)
  // return true when the values match exactly
  function exactMatch(value1, value2) {

    // YOUR CODE HERE!

  }

  // simple test logging
  function testMatch(v1, v2, expected) {
    let
      match = exactMatch(v1, v2),
      pass = (match === expected ? 'PASS' : 'FAIL');

    console.log(v1, v2)
    console.log('match: ' + match + ' - ' + pass + '\n');
  }

  // test
  testMatch(0, 0, true);
  testMatch(1, true, false);
  testMatch(0, '0', false);
  testMatch(null, undefined, false);
  testMatch(Infinity, NaN, false);
  testMatch(NaN, NaN, true);

})();
