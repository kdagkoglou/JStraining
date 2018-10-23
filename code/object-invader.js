#!/usr/bin/env node

/*
JavaScript Invader objects
*/

(() => {

  'use strict';

  function Invader(x, y, dir = 1, score = 10, img = 'invader.png') {

    this.width = 20;
    this.height = 20;

    this.gap = 10;

    // initial properties
    this.alive = true;
    this.posX = x * (this.width + this.gap);
    this.posY = y * (this.height + this.gap);
    this.dir = dir * 5;
    this.score = score;
    this.canfire = false;

    // show invader
    let image = document.createElement('img');
    image.src = img;
    this.sprite = document.body.appendChild(image);

    this.move();

  }

  // move invader
  Invader.prototype.move = function() {

    if (!this.alive) return;

    // calculate position
    this.posX += this.dir;

    // at screen edge?
    if (this.posX <= 0 || this.posX >= 400) {
      this.dir = -this.dir;
      this.posY += this.width + this.gap;
    }

    // move position
    //this.sprite.style.left = this.posX + 'px';
    //this.sprite.style.top = this.posY + 'px';
    console.log(this.posX, this.posY);

    if (this.alive) {
      setTimeout(() => { this.move(); }, 100);
    }

  };


  // am I hit
  // pass in co-ordinates of user's fired laser
  Invader.prototype.amIhit = function(x, y) {

    if (!x || !y) return;

    this.alive = x > this.posX && x < this.posX + this.width && y > this.posY && y < this.posY + this.height;

    return !this.alive;

  };


  // saucer object
  function Saucer() {}
  Saucer.prototype = new Invader(0, 0, 1, 1000, 'saucer.png');


  // move invader
  Saucer.prototype.move = function() {

    Invader.prototype.move.call(this);

    // at screen edge?
    if (this.posX >= 400) {
      this.alive = false;
    }

  };

  // create invaders
  let alien = [];

  for (let i = 59; i >= 0; i--) {

    let
      row = Math.floor(i / 10),
      col = i % 10;

    // note the `new`
    alien[i] = new Invader(col, row, 1, (6 - row) * 10);

  }

  new Saucer();

})();
