# Testing

There are many different types of testing but the primary ones used during development are:

1. Unit testing: testing individual functions to check that known results are returned for specific inputs.
1. Integration testing: testing the interaction between integrated units.
1. Behaviour testing: testing that UI components update as expected.

Test-Driven Development (TDD) is a method of writing code where you:

1. Write code to test your function. The test will fail because the function does not exist.
1. Complete your function so the tests pass.

This works well - in theory. In reality, many developers start with the code then add tests to ensure code remains operational. This is especially evident in more agile development teams where the system's functionality is being devised without a concrete plan.


## Test systems

The popular options are:

* [Jest](https://jestjs.io/) - general purpose
* [Jasmine](https://jasmine.github.io/) - behaviour
* [Mocha](https://mochajs.org/) - general purpose
* [AVA](https://github.com/avajs/ava) - lightweight


## Writing tests

The majority of test systems use English-like syntax to describe a test with an expectation and a matcher, e.g. in Jest:

```js
// include code to test
const lib = require('../modules/lib');

// run test
test('arraySum [1,2,3] equals 6', () => {
  // expectation	              // matcher
  expect(lib.arraySum([1,2,3])).toBe(6);
});
```

Other options are normally provided to:

* match specific types such as deeply-nested objects or arrays
* run and test asynchronous code
* define setup and teardown functions which execute before and after tests are run, e.g. to connect to and disconnect from a database
* mock functions to test how and when something is run
* snapshot testing to compare before and after screenshots of a UI
* code coverage metrics to determine which branches have and have not been followed
* run all or specific tests, perhaps when code changes
