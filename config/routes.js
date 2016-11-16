module.exports = (app, base) => {
  app.get('/', (req, res) => {
    let response = [];
    base('Students').select().eachPage((records, next) => {
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
