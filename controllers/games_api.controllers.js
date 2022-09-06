const {
  selectAllCategories,
  selectReviewById,
  selectUsers,
  updateReviewById,
  selectReviews,
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

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateReview = (req, res, next) => {
  updateReviewById(req.params, req.body)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  selectReviews(req.query)
    .then()
    .catch((err) => {
      next(err);
    });
};
