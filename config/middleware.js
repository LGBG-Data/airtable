const morgan = require('morgan');

module.exports = (app, express) => {
  app.use(morgan('dev'));
};
