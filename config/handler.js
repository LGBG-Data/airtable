module.exports = {
  getData: (req, res) => {
    let response = [];
    req.base.select().eachPage((records, next) => {

      records.forEach(record => {

        response.push(record._rawJson);

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