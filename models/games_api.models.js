const db = require("../db/connection");
const { checkQuery } = require("../utilities/check_query");

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

  let queryStr = `
  SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id):: INT AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id
  `;
  const queryValues = [];

  if (category) {
    queryStr += ` WHERE category = $1`;
    queryValues.push(category);
  }

  const result = checkQuery(query);
  if (typeof result === "object") {
    return Promise.reject(result);
  }
  queryStr += result;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
    return rows;
  });
};

exports.getCommentsByReviewId = (reviewId) => {
  const { review_id: id } = reviewId;

  const queryStr = `
  SELECT comment_id, reviews.votes, reviews.created_at, owner AS author, body, reviews.review_id
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id
  AND body IS NOT NULL
  WHERE reviews.review_id = $1
  ORDER BY comment_id;
  `;
  const queryValues = [id];

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: `review id: ${id} not found` });
    } else if (!rows[0].comment_id) {
      return Promise.reject({
        status: 200,
        msg: `no comments made for review id: ${id}`,
      });
    }
    return rows;
  });
};

exports.addCommentByReviewId = (reviewId, bodyObj) => {
  if (!bodyObj.hasOwnProperty("username") || !bodyObj.hasOwnProperty("body")) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const { review_id: id } = reviewId;
  const { username, body } = bodyObj;

  const queryStr = `
  INSERT INTO comments (review_id, author, body)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  const queryValues = [id, username, body];

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows[0];
  });
};

exports.deleteCommentById = (commentId) => {
  const { comment_id: id } = commentId;

  const queryStr = `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;
  `;
  const queryValues = [id];

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `comment id: ${id} doesn't exist`,
      });
    }
    const status = 204;
    return status;
  });
};

exports.selectUserByUsername = (username) => {
  const queryStr = `
    SELECT * FROM users
    WHERE username = $1;
  `;
  const queryValues = [username];

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `username: ${username} not found`,
      });
    }
    return rows[0];
  });
};

exports.updateCommentById = (commentId, body) => {
  if (!body.hasOwnProperty("inc_votes")) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const { comment_id: id } = commentId;
  const { inc_votes: votes } = body;

  const queryStr = `
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;
  `;

  const queryValues = [votes, id];

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `comment id: ${id} not found`,
      });
    }
    return rows[0];
  });
};

exports.addReview = (newReview) => {
  if (
    !newReview.hasOwnProperty("owner") ||
    !newReview.hasOwnProperty("title") ||
    !newReview.hasOwnProperty("review_body") ||
    !newReview.hasOwnProperty("designer") ||
    !newReview.hasOwnProperty("category")
  ) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const { owner, title, review_body, designer, category } = newReview;
  if (title.length === 0 || review_body.length === 0 || designer.length === 0) {
    return Promise.reject({ status: 400, msg: "no empty values" });
  }

  const queryStr = `
  INSERT INTO reviews (owner, title, review_body, designer, category)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
  `;
  const queryValues = [owner, title, review_body, designer, category];

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows[0];
  });
};
