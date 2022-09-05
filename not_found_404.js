app.use("*", error404);

exports.error404 = (req, res) => {
  res.status(404).send({ msg: "page not found :(" });
};

test("return 404 page not found when incorrect endpoint is inserted", () => {
  return request(app)
    .get("/api/incorrectEndpoint:(")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("page not found :(");
    });
});
