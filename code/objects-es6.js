#!/usr/bin/env node

/*
JavaScript ES6 (EcmaScript 2015) class
*/

(() => {

  'use strict';

  class Animal {

    constructor(name = 'anonymous', legs = 4, noise = 'silent') {

      this.type = 'animal';
      this.name = name;
      this.legs = legs;
      this.noise = noise;

    }

    set typeOf(type) {
      this.type = type.toLowerCase();
    }

    get typeOf() {
      return this.type;
    }

    speak() {
      console.log(`${this.name} says ${this.noise}.`);
    }

    walk() {
      console.log(`${this.name} is a ${this.type} and walks on ${this.legs} legs.`);
    }

  }


  // Dog animals
  class Dog extends Animal {

    constructor(name) {
      super(name, 4, 'woof');
      super.typeOf = 'dog';
      Dog.counter++;
    }

    static get count() {
      return Dog.counter;
    }

  }

  Dog.counter = 0;


  let rex = new Animal('rex', 4, 'woof');
  rex.typeOf = 'DOG';
  //rex.type = 'CAT';
  rex.speak();
  rex.walk();

  console.log(Dog.count);

  let bob = new Dog('bob');
  bob.speak();
  bob.walk();

  console.log(Dog.count);


})();
