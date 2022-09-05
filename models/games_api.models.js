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

exports.selectReviewById = (review_id) => {
  const { review_id: id } = review_id;

  const queryStr = `
  SELECT review_id, title, review_body, designer, review_img_url, votes, slug AS category, owner, created_at
  FROM reviews
  JOIN categories
  ON reviews.category = categories.slug
  JOIN users
  ON reviews.owner = users.username
  WHERE review_id = $1;
  `;
  const queryValues = [id];

  return db.query(queryStr, queryValues).then(({ rows }) => {
    console.log(rows);
    return rows[0];
  });
};
