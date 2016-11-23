const express = require('express');

if (process.env.NODE_ENV !== 'production') {
  const config = require('./config');
}

const PORT = process.env.PORT || config.port;

const app = express();

require('./config/middleware')(app);
require('./config/routes')(app);

app.set('port', PORT);
app.listen(app.get('port'), () => {
  console.log('listening on port', app.get('port'));
});
