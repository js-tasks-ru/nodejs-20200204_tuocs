const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (path.parse(req.url).dir !== '/') {
        res.statusCode = 400;
        res.end('Invalid filename');
        return;
      }
      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }
      fs.unlink(filepath, (e) => {
        if (e) {
          res.statusCode = 500;
          res.end('Internal server error');
        }
        res.statusCode = 200;
        res.end('File removed');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
