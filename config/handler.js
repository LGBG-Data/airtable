

module.exports = {

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

  getView: (req, res) => {
    let view = req.params.view;
    let response = [];
    req.base('Students').select().eachPage((records, next) => {

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