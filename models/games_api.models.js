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
  SELECT reviews.review_id, title, review_body, designer, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT(comments.review_id):: INT AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id;
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

exports.updateReviewById = (reviewId, body) => {
  if (!body.hasOwnProperty("inc_votes")) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const { review_id: id } = reviewId;
  const { inc_votes: vote } = body;

  const queryStr = `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;
  `;

  const queryValues = [vote, id];

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "review not found" });
    }
    return rows[0];
  });
};

exports.selectReviews = (query) => {
  const { category } = query;
};
