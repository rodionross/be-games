exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (
    err.code === "23503" &&
    err.constraint === "comments_author_fkey"
  ) {
    res.status(400).send({ msg: "incorrect username for the review id" });
  } else if (
    err.code === "23503" &&
    err.constraint === "comments_review_id_fkey"
  ) {
    res.status(404).send({ msg: "review id doesn't exist" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal ierver error" });
};
