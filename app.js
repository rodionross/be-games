const express = require("express");
const {
  getCategories,
  getReviewsById,
  getUsers,
  updateReview,
} = require("./controllers/games_api.controllers");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", updateReview);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
