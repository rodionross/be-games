const express = require("express");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./controllers/error_handling.controllers");
const {
  getCategories,
  getReviewsById,
  getUsers,
  updateReview,
  getReviews,
  getComments,
  addComment,
  deleteComment,
  notFound404,
  getApi,
  getUsersByUsername,
} = require("./controllers/games_api.controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews", getReviews);
app.get("/api/users", getUsers);
app.get("/api/reviews/:review_id/comments", getComments);
app.get("/api/users/:username", getUsersByUsername);

app.patch("/api/reviews/:review_id", updateReview);

app.post("/api/reviews/:review_id/comments", addComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api", getApi);

app.use("*", notFound404);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
