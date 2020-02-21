const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream= require('./LimitSizeStream');
const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File exist');
        return;
      }
      if (path.parse(req.url).dir !== '/') {
        res.statusCode = 400;
        res.end('Invalid filename');
        return;
      }

      const limitedStream = new LimitSizeStream({limit: 1024 * 1024});
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

      req
          .pipe(limitedStream)
          .on('error', (err) => {
            if (fs.existsSync(filepath)) {
              fs.unlink(filepath, (e) => {
                res.statusCode = 413;
                res.end('File is too big');
              });
            }
          })
          .pipe(writeStream)
          .on('error', (err) => {
            if (fs.existsSync(filepath)) {
              fs.unlink(filepath, (e) => {
                res.statusCode = 500;
                res.end('Internal server error');
              });
            }
          })
          .on('close', () => {
            if (!req.complete) {
              writeStream.destroy();
              fs.unlink(filepath, () => {
                res.statusCode = 500;
                res.end('Internal server error');
              });
            }
          });

      req.on('aborted', () => {
        writeStream.destroy();
        fs.unlink(filepath, (err) => {
          if (err) throw new Error();
        });
      });

      writeStream.on('close', () => {
        res.statusCode = 201;
        res.end('File created');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
