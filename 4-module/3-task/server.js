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
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }

      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end('File does not exist');
        return;
      }

      fs.unlink(filepath, () => {
        res.statusCode = 200;
        res.end('File was deleted successfully');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  req.on('aborted', () => {
    res.statusCode = 500;
    res.end('Internal server error');
  });
});

module.exports = server;
