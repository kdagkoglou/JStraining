#!/usr/bin/env node

/*
closure
*/

(function() {

  'use strict';

  function Hello(name = 'anonymous') {

    this.name = name;

    console.log(`Hello ${this.name}`);

    var T = this;

    setTimeout(function() {
      console.log(`Goodbye ${T.name}`);
    }, 1000);

  }

  let h = new Hello('Kostas');

  console.log('I have ended');

})();
