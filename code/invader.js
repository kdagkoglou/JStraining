/*
a single value - gameScore - is set using an Immediately Invoked Function Expression (IIFE) which returns a list of public methods

All variables and functions defined in gameScore are private unless revealed in the return statement
*/
var game = game || {};

game.gameScore = (function() {

  'use strict';

  // private configuration
  var
    score = 0,

    // score for hitting an invader at a level
    invaderScore = [
      10, 20, 40, 50, 100
    ];

  // ensure a level is valid
  function validLevel(level) {
    return Math.max(0, Math.min(level || 0, invaderScore.length - 1));
  }

  // invader is hit
  function hitInvader(level) {
    score += invaderScore[ validLevel(level) ];
  }

  // show score
  function show() {
    console.log(score);
  }

  // return list of public methods
  return {
    hitInvader: hitInvader,
    show: show
  };

})();


// main code
game.gameScore.hitInvader(0);
game.gameScore.hitInvader(1);
game.gameScore.hitInvader(15);

game.gameScore.show();

// fails
console.log(game.gameScore.score);
