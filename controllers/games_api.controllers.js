const {
  selectAllCategories,
  selectReviewById,
} = require("../models/games_api.models");

exports.getCategories = (req, res, next) => {
  selectAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewsById = (req, res, next) => {
  selectReviewById(req.params)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
