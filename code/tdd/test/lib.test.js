// test library functions
/* global test expect */

const lib = require('../modules/lib');

// test
test('arraySum [1,2,3] equals 6', () => {
  // expectation	              // matcher
  expect(lib.arraySum([1,2,3])).toBe(6);
});

test('arraySum [\'a\',\'b\',\'c\'] equals \'abc\'', () => {
  expect(lib.arraySum(['a','b','c'])).toBe('abc');
});

test('pause for random period', async () => {
  await expect(lib.pause()).resolves.toBeGreaterThan(0);
});
