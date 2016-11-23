const handler = require('./handler');

module.exports = (app, base) => {
  app.get('/api/:table', (req, res, next) => {
    req.base = base(req.params.table);
    next();
  }, handler.getData);
};
