#!/usr/bin/env node

/*
regular expressions
*/

(() => {

  'use strict';

  let re = /abc/ig;
  // let char = 'c';
  // let re = new RegExp('ab' + char, 'i');

  // console.log( re.test('Abc') );
  // console.log( re.test('abc') );
  // console.log( re.test('abd') );

  // console.log( re.exec('abc') );
  // console.log( re.exec('abc123abc') );

  let str = 'axc123abc45  6abb,c789!abbbc';

  // console.log( str.search(re) );
  // console.log( str.split(re) );
  // console.log( str.match(re) );
  // console.log( str.replace(re, 'XYZ') );

  let re1 = /.+@(\w+\.)+\w+/m;
  // console.log( re1.exec(str) );
  console.log( 'craig@testcom'.match(re1) );

  let inputString = '  something\r\n \r from \n the \r\n  \n user\n\n';

  let i = inputString
    .replace(/\s*\n\s*/g, '^')
    .replace(/\s+/g, ' ')
    .replace(/\^+/g, '^')
    .replace(/\^/g, '\n')
    .trim();

  console.log(i);

})();
