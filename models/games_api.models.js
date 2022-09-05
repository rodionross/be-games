const db = require("../db/connection");

exports.selectAllCategories = () => {
  const queryStr = `SELECT * FROM categories;`;

  return db.query(queryStr).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, msg: "no categories" });
    }
    rows.forEach((category) => {
      if (
        !category.hasOwnProperty("slug") ||
        !category.hasOwnProperty("description")
      ) {
        return Promise.reject({ status: 400, msg: "wrong properties" });
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
  WHERE review_id = $1;
  `;
  const queryValues = [id];

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, msg: "user not found" });
    }
    return rows[0];
  });
};

exports.selectUsers = () => {
  const queryStr = `SELECT * FROM users;`;

  return db.query(queryStr).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, msg: "no users" });
    }
    rows.forEach((user) => {
      if (
        !user.hasOwnProperty("username") ||
        !user.hasOwnProperty("name") ||
        !user.hasOwnProperty("avatar_url")
      ) {
        return Promise.reject({ status: 400, msg: "wrong properties" });
      }
    });
    return rows;
  });
};
