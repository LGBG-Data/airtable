const keep = require('../pbi_students');

// filters record to contain only props in keep;
// returns a new object
const narrow = record => {
  let slim = {};
  let props = Object.keys(record).forEach(prop => {
    if (keep.indexOf(prop) > -1) {
      slim[prop] = record[prop];
    }
  });
  return slim;
}

module.exports = {

  // returns raw data for any valid table identifier
  getTable: (req, res) => {
    let table = req.params.table;
    let response = [];
    req.base(table).select().eachPage((records, next) => {
      records.forEach(record => response.push(record));
      next();
    }, err => {
      if (err) {
        throw err;
      }
      res.json(response);
    });
  },

  // returns filtered data from the 'Students' table
  getView: (req, res) => {
    let view = req.params.view;
    let response = [];
    req.base('Students').select().eachPage((records, next) => {
      records.forEach(record => response.push(narrow(record)));
      next();
    }, err => {
      if (err) {
        throw err;
      }
      res.json(response);
    });
  }
}