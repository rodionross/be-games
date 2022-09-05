const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("../db/seeds/utils");

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
        expect(body.categories.length).toBeGreaterThan(0);
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
  test("returns error if user doesnt exist", () => {
    return request(app)
      .get("/api/reviews/9999")
      .expect(400)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.msg).toBe("user not found");
      });
  });
});

describe("GET /api/users", () => {
  test("returns an array of users objects with correct properties types", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBeGreaterThan(0);
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
