const express = require('express');
const Airtable = require('airtable');

var config;

if (process.env.NODE_ENV !== 'production') {
  config = require('./config');
}

const BASE = process.env.BASE || config.BASE;
const KEY = process.env.KEY || config.KEY;
const PORT = process.env.PORT || config.PORT;

const app = express();

const base = new Airtable({
  apiKey: KEY
}).base(BASE);

require('./config/middleware')(app, base, KEY);
require('./config/routes')(app);

app.set('port', PORT);
app.listen(app.get('port'), () => {
  console.log('listening on port', app.get('port'));
});
