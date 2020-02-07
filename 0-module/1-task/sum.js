function sum(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError('Is not a number!');
  }
  return a + b;
}

module.exports = sum;
