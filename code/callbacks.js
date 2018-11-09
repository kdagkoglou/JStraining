#!/usr/bin/env node

/*
Promises and async/await

APIs can support both callbacks and Promises. See the run() function from line 29...
https://bitbucket.org/empello/guardian4_api/src/master/index.js
*/

(function() {

  'use strict';

  // connect to database
  function asyncDBconnect(param) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        resolve(param);

      }, 1000);

    });

  }


  // open file
  function fileOpen(file) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        resolve(file);

      }, 1000);

    });

  }


  async function doAll() {

    try {
      let
        res1 = await asyncDBconnect('connect me 4'),
        res2 = await fileOpen('my file 4');

      console.log('ASYNC:', res1, res2);
    }
    catch(err) {
      console.log('ASYNC ERR:', err);
    }

  }


  // async/await
  (async () => doAll())();

  // done in order
  asyncDBconnect('connect me')
    .then(result => { console.log(result); })
    .then(result => fileOpen('my file'))
    .then(result => { console.log(result); })
    .catch(err => {
      console.log('ERROR!', err);
    })
    .finally(() => {
      // clean-up
      console.log('clean up');
    });


  // run all at same time
  Promise.all([
    asyncDBconnect.call(this, 'connect me 2'),
    fileOpen.call(this, 'my file 2')
  ])
    .then(values => {
      console.log(values);
    })
    .catch(err => {
      console.log('ERROR!', err);
    });

  // run all at same time, but complete on first to finish
  Promise.race([
    asyncDBconnect.call(this, 'connect me 3'),
    fileOpen.call(this, 'my file 3')
  ])
    .then(values => {
      console.log(values);
    })
    .catch(err => {
      console.log('ERROR!', err);
    });

  console.log('finished');

})();
