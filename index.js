const Airtable = require('airtable');
const express = require('express');
var config;

if (process.env.NODE_ENV !== 'production') {
  config = require('./config');
}

const BASE = process.env.BASE || config.base;
const KEY = process.env.KEY || config.key;
const PORT = process.env.PORT || config.port;

const base = new Airtable({
  apiKey: KEY
}).base(BASE);

const app = express();

require('./config/middleware')(app, base, KEY);
require('./config/routes')(app);

app.set('port', PORT);
app.listen(app.get('port'), () => {
  console.log('listening on port', app.get('port'));
});
