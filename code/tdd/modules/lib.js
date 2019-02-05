// library functions

module.exports = (() => {


  // sum array elements
  function arraySum(array) {
    return array.reduce((a, v) => a + v);
  }

  // pause and return number of ms
  function pause(delay = Math.floor(Math.random() * 1000)+1) {
    return new Promise(
      resolve => setTimeout(() => { resolve(delay); }, delay)
    );
  }


  // public methods
  return {
    arraySum: arraySum,
    pause: pause
  };

})();
