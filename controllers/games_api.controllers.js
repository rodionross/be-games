const {
  selectAllCategories,
  selectReviewById,
  selectUsers,
  updateReviewById,
  selectReviews,
  getCommentsByReviewId,
  addCommentByReviewId,
  deleteCommentById,
  selectUserByUsername,
  updateCommentById,
} = require("../models/games_api.models");

const endpoints = require("../endpoints.json");

exports.notFound404 = (req, res) => {
  res.status(404).send({ msg: "page not found :(" });
};

exports.getApi = (req, res) => {
  res.status(200).send(endpoints);
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

exports.updateReviews = (req, res, next) => {
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
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  getCommentsByReviewId(req.params)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addComment = (req, res, next) => {
  addCommentByReviewId(req.params, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  deleteCommentById(req.params)
    .then((status) => {
      res.status(status).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsersByUsername = (req, res, next) => {
  selectUserByUsername(req.params.username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateComments = (req, res, next) => {
  updateCommentById(req.params, req.body)
    .then((updatedComment) => {
      res.status(201).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    });
};
