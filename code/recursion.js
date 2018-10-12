#!/usr/bin/env node

/*
recursive functions
*/

(function() {

  'use strict';

  const obj = {
    a: 1,
    b: 2,
    c: [
      { d: 4, e: 5 },
      [
        { f: 6 },
        { g: 7 }
      ],
      { h: 8 }
    ],
    i: 9
  };

  recurse(obj);

  // output single name and value pairs
  function recurse(o) {

    for (let p in o) {
      if (typeof o[p] === 'object') recurse( o[p] );
      else console.log(p, '=', o[p]);
    }

  }

})();
