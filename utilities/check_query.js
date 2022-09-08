exports.checkQuery = (queries) => {
  const { sort_by, order } = queries;
  const columns = [
    "owner",
    "title",
    "review_id",
    "category",
    "review_img_url",
    "created_at",
    "votes",
    "designer",
    "comment_count",
  ];
  let columnExists = false;
  let orderExists = false;
  const rejected = { status: 400, msg: "bad request" };

  if (order === "asc" || order === "desc") {
    orderExists = true;
  }
  for (let element of columns) {
    if (sort_by === element) {
      columnExists = true;
    }
  }

  if (sort_by === undefined && order === undefined) {
    return ` GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;`;
  } else if (!columnExists || !orderExists) {
    return rejected;
  } else if (columnExists) {
    return ` GROUP BY reviews.review_id ORDER BY ${sort_by} DESC;`;
  } else if (orderExists) {
    return ` GROUP BY reviews.review_id ORDER BY reviews.created_at ${order};`;
  } else {
    return ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;
  }
};
