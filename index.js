const Airtable = require('airtable');
const express = require('express');

const {BASE, KEY, PORT} = process.env;

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
