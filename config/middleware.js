const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = (app, base, KEY) => {

  app.use(morgan('dev'));

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use((req, res, next) => {

    const {authorization} = req.headers;

    if (authorization && authorization.endsWith(KEY)) {

      req.base = base;
      
      return next();
    }
     
    return res.sendStatus(403);
  });
};
