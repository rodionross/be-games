const db = require("../db/connection");

exports.selectAllCategories = () => {
  const queryStr = `SELECT * FROM categories;`;

  return db.query(queryStr).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 400,
        msg: "categories table does not exist",
      });
    }

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
      return Promise.reject({ status: 404, msg: "review not found" });
    }
    return rows[0];
  });
};

exports.selectUsers = () => {
  const queryStr = `SELECT * FROM users;`;

  return db.query(queryStr).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, msg: "users table does not exist" });
    }

    return rows;
  });
};

exports.updateReviewById = (review_id, body) => {
  const { review_id: id } = review_id;
  const { inc_votes: vote } = body;

  const queryStr = `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;
  `;
  const queryValues = [vote, id];

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows[0];
  });
};
