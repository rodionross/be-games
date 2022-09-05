const db = require("../db/connection");

exports.selectAllCategories = () => {
  const queryStr = `SELECT * FROM categories;`;

  return db.query(queryStr).then(({ rows }) => {
    rows.forEach((category) => {
      if (
        !category.hasOwnProperty("slug") ||
        !category.hasOwnProperty("description")
      ) {
        return Promise.reject({ status: 400, msg: "wrong pproperties" });
      }
    });

    return rows;
  });
};
