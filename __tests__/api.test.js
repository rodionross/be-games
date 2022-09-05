const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET/api/categories", () => {
  test("return an array of category objects containing slug and description properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories.length).toBe(4);
        body.categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("returns a review object based on the review_id param", () => {
    const result = {
      review_id: 2,
      title: "Jenga",
      review_body: "Fiddly fun for all the family",
      designer: "Leslie Scott",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      votes: 5,
      category: "dexterity",
      owner: "philippaclaire9",
      created_at: "2021-01-18T10:01:41.251Z",
    };
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual(result);
      });
  });
  test("returns error if review doesnt exist", () => {
    return request(app)
      .get("/api/reviews/9999")
      .expect(404)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.msg).toBe("review not found");
      });
  });

  test("returns error if invalid param is inserted", () => {
    return request(app)
      .get("/api/reviews/dogs")
      .expect(400)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("returns an array of users objects with correct properties types", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("returns updated review object based on the id param", () => {
    return request(app)
      .patch("/api/reviews/2")
      .expect(201)
      .send({ inc_votes: 1 })
      .then(({ body }) => {});
  });
});
