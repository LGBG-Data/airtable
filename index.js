const config = require('./config');
const Airtable = require('airtable');
const express = require('express');

const PORT = process.env.PORT || config.port;
const BASE = process.env.BASE || config.base;
const KEY = process.env.KEY || config.key;

const app = express();
const base = new Airtable({apiKey: KEY}).base(BASE);

require('./config/middleware')(app, express);
require('./config/routes')(app, base);

app.set('port', PORT);
app.listen(app.get('port'), () => {
  console.log('listening on port', app.get('port'));
});
