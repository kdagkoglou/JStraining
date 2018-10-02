#!/usr/bin/env node

/*
closure
*/

(function() {

  'use strict';

  function hello(name = 'anonymous') {

    console.log(`Hello ${name}`);

    setTimeout(() => {
      console.log(`Goodbye ${name}`);
    }, 2000);

  }

  hello('Kostas');

  console.log('I have ended');

})();
