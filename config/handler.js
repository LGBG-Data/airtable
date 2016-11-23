const Airtable = require('airtable');

if (process.env.NODE_ENV !== 'production') {
  const config = require('./config');
}

const BASE = process.env.BASE || config.base;

module.exports = {

  auth: (req, res, next) => {
    let key = req.headers.authorization;
    if (key) {
      req.base = new Airtable({
        apiKey: key
      }).base(BASE);
      next();
    }
    res.sendStatus(403);
  },

  getTable: (req, res) => {
    let table = req.params.table;
    let response = [];
    req.base.select(table).eachPage((records, next) => {
      records.forEach(record => response.push(record));
      next();
    }, err => {
      if (err) {
        throw err;
      }
      res.json(response);
    });
  },

  getView: (req, res) => {
    let view = req.params.view;
    let response = [];
    req.base.select('Students').eachPage((records, next) => {

      records.forEach(record => {

        let student = record._rawJson;
        let agg = {};

        response.push(agg);
      });

      next();
    }, err => {
      if (err) {
        throw err;
      }
      res.json(response);
    });
  }
}