module.exports = (app, base) => {
  app.get('/:table', (req, res) => {
    let response = [];
    base(req.params.table).select().eachPage((records, next) => {
      records.forEach(record => response.push(record._rawJson));
      next();
    }, err => {
      if (err) {
        throw err;
      }
      res.json(response);
    });
  });
};
