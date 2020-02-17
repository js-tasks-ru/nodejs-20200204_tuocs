const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    this.data += chunk.toString();
    callback();
  }

  _flush(callback) {
    const dataArr = this.data.split(os.EOL);
    dataArr.map((packet) => {
      this.push(packet);
    });
    callback();
  }
}

module.exports = LineSplitStream;
