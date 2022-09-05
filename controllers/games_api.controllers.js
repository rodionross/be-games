const {
  selectAllCategories,
  selectReviewById,
} = require("../models/games_api.models");

exports.error404 = (req, res) => {
  res.status(404).send({ msg: "page not found :(" });
};

exports.getCategories = (req, res, next) => {
  selectAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewsById = (req, res) => {
  selectReviewById(req.params).then((review) => {
    res.status(200).send({ review });
  });
};
