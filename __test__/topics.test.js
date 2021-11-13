const { response } = require("express");
const request = require("supertest");
const app = require("../app");
const { Topic, sequelize, User } = require("../models");

const user = {
  email: "johnganteng@mail.com",
  password: "john",
  name: "John The Man",
  gender: "male",
  role: "admin",
};

let access_token = null;
beforeAll((done) => {
  User.create(user)
    .then(() => {
      return request(app)
        .post("/admin/login")
        .send({ email: user.email, password: user.password });
    })
    .then((response) => {
      const { body } = response;
      access_token = body.access_token;
      done();
    })
    .catch((error) => done(error));
});

afterAll((done) => {
  const option = {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  };
  Topic.destroy(option)
    .then((_) => User.destroy(option))
    .then((_) => done())
    .catch((error) => done(error));
});

describe("POST /topics - Create new topic test", () => {
  const dataTopic = { name: "percintaan" };
  test("(201 - Created)  Response should have the correct property and value", (done) => {
    request(app)
      .post("/topics")
      .set({ access_token })
      .send(dataTopic)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(201);
        expect(body).toHaveProperty("topic");
        expect(body.topic).toEqual(expect.any(Object));
        expect(body.topic).toHaveProperty("name");
        expect(body.topic).toHaveProperty("id");
        expect(body.topic.id).toEqual(expect.any(Number));
        expect(body.topic.name).toBe(dataTopic.name);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test("(400 - Bad Request) Response should have the correct property and value", (done) => {
    request(app)
      .post("/topics")
      .send({})
      .set({ access_token })
      .then((response) => {
        const { body, status } = response;
        expect(body).toHaveProperty("message");
        expect(status).toBe(400);
        expect(body.message).toEqual(["topic name cannot null!"]);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});

describe("GET /topics -  Get all topics test", () => {
  test("(200 - OK) Response should have the correct property and value", (done) => {
    request(app)
      .get("/topics")
      .set({ access_token })
      .then((response) => {
        const { body } = response;
        expect(body).toHaveProperty("topics");
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});

describe("GET /topics/:id - Get topic by id", () => {
  test("(404 - NOT FOUND) Response should have the correct property and value", (done) => {
    request(app)
      .get("/topics/1")
      .set({ access_token })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("topic");
        expect(body.topic).toHaveProperty("id");
        expect(body.topic).toHaveProperty("name");
        expect(body.topic.id).toBe(1);
        expect(body.topic.name).toEqual(expect.any(String));
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test("(200 - OK) Response should have the correct property and value", (done) => {
    request(app)
      .get("/topics/999")
      .set({ access_token })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Topic not found");
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});

describe("PUT /topics/:id - Edit topic data by id test", () => {
  const payload = { name: "keluarga" };
  const expected = { id: 1, name: "keluarga" };
  test("(200 - OK) Response should return update topic data", (done) => {
    request(app)
      .put("/topics/1")
      .send(payload)
      .set({ access_token })
      .then((response) => {
        const { body } = response;
        expect(body).toHaveProperty("topic");
        expect(body.topic).toHaveProperty("id");
        expect(body.topic).toHaveProperty("name");
        expect(body.topic.id).toBe(expected.id);
        expect(body.topic.name).toBe(expected.name);
        done();
      })
      .catch((error) => done(error));
  });

  test("(400 - Bad Request) Response should have error message", (done) => {
    request(app)
      .put("/topics/1")
      .send({ name: "" })
      .set({ access_token })
      .then((response) => {
        const { body, status } = response;
        expect(body).toHaveProperty("message");
        expect(body.message).toEqual(["topic name is required"]);
        expect(status).toBe(400);
        done();
      })
      .catch((error) => done(error));
  });

  test("(400 - Bad Request) Response should have error message", (done) => {
    request(app)
      .put("/topics/99")
      .send({ name: "percintaan" })
      .set({ access_token })
      .then((response) => {
        const { body, status } = response;
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Topic not found");
        expect(status).toBe(404);
        done();
      })
      .catch((error) => done(error));
  });
});

describe("DELETE /topics/:id - Delete topic data by id test", () => {
  test("(404 - NOT FOUND) should return error message", (done) => {
    request(app)
      .delete("/topics/99")
      .set({ access_token })
      .then((response) => {
        const { body, status } = response;
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Topic not found");
        expect(status).toBe(404);
        done();
      })
      .catch((error) => done(error));
  });

  test("(404 - NOT FOUND) should return error message", (done) => {
    request(app)
      .delete("/topics/1")
      .set({ access_token })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toEqual(expect.any(String));
        done();
      })
      .catch((error) => done(error));
  });
});
