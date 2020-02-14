const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.weight = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.weight += chunk.length;
    if (this.weight > this.limit) {
      callback(new LimitExceededError());
    }
    this.push(chunk);
    callback();
  }
}

module.exports = LimitSizeStream;
