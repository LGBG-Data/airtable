const Promise = require('bluebird');
const views = require('../pbi');
const listViews = Object.keys(views);

const query = (base, {table, field}, link) => {
  return new Promise((resolve, reject) => {
    base(table).find(link, (err, found) => {
      if (err) {
        reject(err);
      }
      resolve(found.fields[field]);
    });
  });
}

module.exports = {

  // returns unfiltered data for the supplied table
  getTable: (req, res) => {
    let table = req.params.table;
    let response = [];
    req.base(table).select().eachPage((records, next) => {
      records.forEach(record => response.push(record.fields));
      next();
    }, err => err ? res.send(err) : res.json(response));
  },

  // returns data for the supplied view (reference ../pbi.json)
  getView: (req, res) => {
    let view = req.params.view;
    let response = [];
    if (listViews.indexOf(view) === -1) {
      throw new Error(`supplied view must be one of ${listViews.join(', ')}`)
    }
    req.base(views[view].table).select().eachPage((records, next) => {
      let promised = [];
      records.forEach(record => {
        let formed = {};
        views[view].keep.forEach(prop => {
          if (prop.alias) {
            formed[prop.alias] = record.fields[prop.alias].length ? [] : null;
            record.fields[prop.alias].forEach(link => {
              promised.push(query(req.base, prop, link).then((found) => {
                formed[prop.alias].push(found);
              }));
            });
          } else {
            formed[prop] = record.fields[prop] || null;
          }
        });
        response.push(formed);
      });
      Promise.all(promised).then(() => next()).catch(err => console.log(err));
    }, err => err ? res.send(err) : res.json(response));
  }
}