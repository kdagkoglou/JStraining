#!/usr/bin/env node

/*
JavaScript objects
*/

(() => {

  'use strict';

  const dog = {
    name: 'Rex',
    type: 'poodle',
    hello: function(intro) {
      console.log(`${intro} ${this.name}. You are a ${this.type}.`);
    }
  };

  dog.name = 'Bob';

  dog.hello('Hi there');

})();
