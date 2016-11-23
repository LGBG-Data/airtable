const handler = require('./handler');

module.exports = (app, base) => {

  app.get('/api/table/:table', handler.getTable);

  app.get('/api/view/:view', handler.getView);
};
