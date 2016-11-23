const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = (app, base, KEY) => {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use((req, res, next) => {
    let bearer = req.headers.authorization;
    if (bearer === KEY) {
      req.base = base;
      next();
    } else {
      res.sendStatus(403);
    }
  });
  app.use(morgan('dev'));
};
