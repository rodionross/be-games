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
      comment_count: 3,
    };
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual(result);
      });
  });
  test("returns a review object based on the review_id param with comment_count as 0 if no comments were made", () => {
    const result = {
      review_id: 1,
      title: "Agricola",
      review_body: "Farmyard fun!",
      designer: "Uwe Rosenberg",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      votes: 1,
      category: "euro game",
      owner: "mallionaire",
      created_at: "2021-01-18T10:00:20.514Z",
      comment_count: 0,
    };
    return request(app)
      .get("/api/reviews/1")
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
        expect(status).toBe(404);
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
  test("returns updated review object based on the review_id param", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 2 })
      .expect(201)
      .then(({ body }) => {
        const result = {
          review_id: 2,
          title: "Jenga",
          category: "dexterity",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_body: "Fiddly fun for all the family",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 7,
        };
        expect(body.review).toEqual(result);
      });
  });
  test("returns a 404 error if review doesnt exists", () => {
    return request(app)
      .patch("/api/reviews/9999")
      .send({ inc_votes: 2 })
      .expect(404)
      .then(({ body, status }) => {
        expect(status).toBe(404);
        expect(body.msg).toBe("review not found");
      });
  });
  test("returns a 400 bad request if inc_votes is not an integer", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: "a" })
      .expect(400)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.msg).toBe("bad request");
      });
  });
  test("returns a 400 bad request if body is not an object and does not have property of inc_votes", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send("notAnObject")
      .expect(400)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.msg).toBe("bad request");
      });
  });
  test("returns a 400 bad request if body is an object but has a different property", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ votes: 2 })
      .expect(400)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.msg).toBe("bad request");
      });
  });
});

describe.only("GET /api/reviews", () => {
  test("returns an array of review objects sorted by date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("returns an array of review objects sorted by date and filtered by query", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        const result = {
          owner: "philippaclaire9",
          title: "Jenga",
          review_id: 2,
          category: "dexterity",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
          designer: "Leslie Scott",
          comment_count: 3,
        };
        expect(body.reviews.length).toBe(1);
        expect(body.reviews[0]).toEqual(result);
      });
  });
  test("returns an error if category doesnt exist ", () => {
    return request(app)
      .get("/api/reviews?category=doggo123")
      .expect(400)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.msg).toBe("bad request");
      });
  });
  // ticket 11
  test("returns 400 error if all queries are invalid", () => {
    return request(app)
      .get("/api/reviews?category=banana&sort_by=banana&order=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("returns 400 error if category query is valid and other queries are invalid", () => {
    return request(app)
      .get("/api/reviews?category=dexterity&sort_by=banana&order=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("returns 400 error if category and sort_by query are valid and sort is invalid", () => {
    return request(app)
      .get("/api/reviews?category=dexterity&sort_by=title&order=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("returns an array by category, sort_by and order if all queries are valid", () => {
    return request(app)
      .get("/api/reviews?category=social deduction&sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("title", { ascending: true });
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("returns array of comments based on params", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(3);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("returns 404 error if review_id doesnt exist", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then(({ body, status }) => {
        expect(status).toBe(404);
        expect(body.msg).toBe("review id: 999 not found");
      });
  });
  test("returns 400 error if review_id is invalid (not an integer)", () => {
    return request(app)
      .get("/api/reviews/doggos/comments")
      .expect(400)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.msg).toBe("bad request");
      });
  });
  test("returns 200 error if review_id exists but no comments are made", () => {
    return request(app)
      .get("/api/reviews/10/comments")
      .expect(200)
      .then(({ body, status }) => {
        expect(status).toBe(200);
        expect(body.msg).toBe("no comments made for review id: 10");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("returns a comment object with correct propertires", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "mallionaire", body: "board games" })
      .expect(201)
      .then(({ body }) => {
        const result = {
          comment_id: 7,
          body: "board games",
          review_id: 2,
          author: "mallionaire",
          votes: 0,
          created_at: expect.any(String),
        };

        expect(body.comment).toEqual(result);
      });
  });
  test("returns a 400 error if username is incorrect for the review_id", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "not_a_name", body: "board games" })
      .expect(400)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.msg).toBe("incorrect username for the review id");
      });
  });
  test("returns a 400 error if review_id exists and body is incorrect type", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send('username: "not_a_name", body: "board games"')
      .expect(400)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.msg).toBe("bad request");
      });
  });
  test("returns a 400 error if review_id exists and body object includes incorrect properties", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ person: "mallionare", comment: "board games" })
      .expect(400)
      .then(({ body, status }) => {
        expect(status).toBe(400);
        expect(body.msg).toBe("bad request");
      });
  });
  test("returns 404 error if review_id doesnt exist and body object contains correct properties", () => {
    return request(app)
      .post("/api/reviews/9999/comments")
      .send({ username: "mallionare", body: "board games" })
      .expect(404)
      .then(({ body, status }) => {
        expect(status).toBe(404);
        expect(body.msg).toBe("review id doesn't exist");
      });
  });
});
