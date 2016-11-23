const bodyParser = require('body-parser');
const handler = require('./handler');
const morgan = require('morgan');

module.exports = app => {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(handler.auth);
  app.use(morgan('dev'));
};
