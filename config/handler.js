const Promise = require('bluebird');
const views = require('../pbi');

const listViews = Object.keys(views);

const scan = (base, record, view) => {
  return new Promise((resolve, reject) => {
    record = record.fields;
    let filtered = {};
    let promised = [];
    views[view].keep.forEach(prop => {
      if (prop.alias) {
        if (record[prop.alias]) {
          filtered[prop.alias] = [];
          record[prop.alias].forEach((link, i) => {
            promised.push(query(base, prop, link).then(found => {
              filtered[prop.alias][i] = found;
            }));
          });
        } else {
          filtered[prop.alias] = null;
        }
      } else if (record[prop]) {
        filtered[prop] = Array.isArray(record[prop]) ? record[prop].join(', ') : record[prop];
      } else {
        filtered[prop] = null;
      }
    });
    Promise.all(promised).then(() => resolve(filtered)).catch(err => console.log(err));
  });
}

const query = (base, {field, table, track}, link) => {
  if (track) {
    return new Promise((resolve, reject) => {
      base(views[track].table).find(link, (err, found) => {
        if (err) {
          reject(err);
        }
        scan(base, found, track).then(scanned => resolve(scanned)).catch(err => console.log(err));
      });
    })
  } else {
    return new Promise((resolve, reject) => {
      base(table).find(link, (err, found) => {
        if (err) {
          reject(err);
        }
        resolve(found.fields[field]);
      });
    });
  }
}

const compile = (base, view) => {
  return new Promise((resolve, reject) => {
    let response = [];
    base(views[view].table).select().eachPage((records, next) => {
      promised = [];
      records.forEach(record => {
        promised.push(scan(base, record, view).then(scanned => response.push(scanned)).catch(err => console.log(err)));
      });
      Promise.all(promised).then(() => next()).catch(err => console.log(err));
    }, err => err ? reject(err) : resolve(response));
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
    if (listViews.indexOf(view) === -1) {
      throw new Error(`supplied view must be one of ${listViews.join(', ')}`)
    }
    compile(req.base, view).then(response => {
      console.log(response.length);
      return res.json(response);
    }).catch(err => res.send(err));
  }
}