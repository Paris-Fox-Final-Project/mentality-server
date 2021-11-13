const request = require("supertest");
const app = require("../app");
const { Topic, sequelize, User } = require("../models");
const { generateToken } = require("../helpers/jwt.js");

const user = {
  email: "johnganteng@mail.com",
  password: "john",
  name: "John The Man",
  gender: "male",
  role: "admin",
};

let payload = {};
beforeAll((done) => {
  User.create(user)
    .then((data) => {
      payload = {
        id: data.id,
        role: data.role,
        name: data.name,
        email: data.email,
      };
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
  const access_token = generateToken(payload);
  const dataTopic = { name: "percintaan" };
  test("(201 - Created) Response should have the correct property and value", (done) => {
    request(app)
      .send(dataTopic)
      .set({ access_token: access_token })
      .then((response) => {
        console.log(response);
        const { body, status } = response;
        console.log(body);
        expect(status).toBe(201);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});
