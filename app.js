const express = require("express");
const {
  getCategories,
  error404,
} = require("./controllers/games_api.controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use("*", error404);

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
