const app = require("../app");
const request = require("supertest");
const { encodePassword } = require("../helpers/bcrypt.js")
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

const admin1 = {
  email: "admintest@mail.com",
  password: encodePassword("admintest"),
  role: 'admin',
  name: "admin test",
  gender: "admin gender",
  avatarUrl: "admin image"
};

afterAll((done) => {
  queryInterface.bulkDelete('Users', {})
    // .then(() => {
    //   return queryInterface.bulkDelete('Courses', {});
    // })
    // .then(() => {
    //   return queryInterface.bulkDelete('MyCourses', {});
    // })
    .then(() => done())
    .catch((err) => done(err));
});

describe("User Routes Test", () => {
  describe("POST /admin/register - create new user", () => {
    test("201 Success register - should create new User", (done) => {
      request(app)
        .post("/admin/register")
        .send(admin1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(201);
          expect(body).toHaveProperty("id", expect.any(Number));
          expect(body).toHaveProperty("name", admin1.name);
          expect(body).toHaveProperty("email", admin1.email);
          return done();
        });
    });

    test("400 Failed register - should return error if email is null", (done) => {
      request(app)
        .post("/admin/register")
        .send({
          password: "qweqwe",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email is required");
          return done();
        });
    });

    test("400 Failed register - should return error if email is already exists", (done) => {
      request(app)
        .post("/admin/register")
        .send(admin1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email must be unique");
          return done();
        });
    });

    test("400 Failed register - should return error if wrong email format", (done) => {
      request(app)
        .post("/admin/register")
        .send({
          email: "random",
          name: "Sample User",
          password: "qweqwe",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Invalid email format");
          return done();
        });
    });
  });

  describe("POST /admin/login - admin login", () => {
    test("200 Success login - should return access_token", (done) => {
      request(app)
        .post("/admin/login")
        .send(admin1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body).toHaveProperty("access_token", expect.any(String));
          return done();
        });
    });

    test("401 Failed login - should return error", (done) => {
      request(app)
        .post("/admin/login")
        .send({
          email: "hello@mail.com",
          password: "salahpassword",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid email/password");
          return done();
        });
    });
  });
});
