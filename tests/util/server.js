var restify = require('restify');

module.exports = function(url, response) {
  beforeEach(function (done) {
    this.server = restify.createServer();
    this.server.use(restify.bodyParser());
    this.server.get(url, function(req, res, next) {
      return res.json(response);
    });
    this.server.post(url, function(req, res, next) {
      res.status(201);
      res.end();
    });
    this.server.put(url + '/:id', function(req, res, next) {
      res.status(200);
      res.end();
    });
    this.server.patch(url + '/:id', function(req, res, next) {
      res.status(200);
      res.end();
    });
    this.server.delete(url + '/:id', function(req, res, next) {
      res.status(200);
      res.end();
    });
    this.server.listen('http://localhost:8080');
  });
  afterEach(function (done) {
    this.server.close();
  });
}