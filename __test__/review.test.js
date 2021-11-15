const { response } = require("express");
const request = require("supertest");
const app = require("../app");
const { Counselor, sequelize, User, Review } = require("../models");
const { generateToken } = require("../helpers/jwt");
const { encodePassword } = require("../helpers/bcrypt");
const { queryInterface } = sequelize;

const userTest1 = {
    email: "user13@gmail.com",
    password: encodePassword("789456123"),
    role: "user",
    name: "user13",
    gender: "Male",
    avatarUrl:
      "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
  };
  const counselor1 = {
    email: "counselor1@gmail.com",
    password: encodePassword("789456123"),
    role: "counselor",
    name: "counselor1",
    gender: "Female",
    avatarUrl:
      "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
  };
beforeAll((done) => {
User.create(userTest1)
    .then(()=>{
        return User.create(counselor1)
    }).then((register1) => {
        console.log(register1, "registe 1 --------------------------")
        return Counselor.create({
          UserId: register1.dataValues.id,
          motto: "motto",
          specialist: "specialist",
          about: "about",
          price: 200000,
        });
      })
    .then(() => {
    done();
    })
    .catch((err) => {
    done(err);
    });
});
  

afterAll((done) => {
    queryInterface
      .bulkDelete(
        "Reviews",
        {},
        { truncate: true, cascade: true, restartIdentity: true }
      ).then(() => {
        return queryInterface.bulkDelete(
          "Users",
          {},
          { truncate: true, cascade: true, restartIdentity: true }
        );
      })
      .then(() => {
        return queryInterface.bulkDelete(
          "Counselors",
          {},
          { truncate: true, cascade: true, restartIdentity: true }
        );
      })
      .then(() => done())
      .catch((err) => done(err));
  });

describe("POST /reviews - Create new review test", () => {
    const access_token_user = generateToken({
        id: 1,
        email: "user13@gmail.com",
        role: "user",
      });

test("(201 - Created)  Response should have the correct property and value", (done) => {
    request(app)
    .post("/reviews")
    .set({ access_token: access_token_user })
    .send({
        "CounselorId": 1,
        "UserId": 1,
        "message": "diselingkuhin sama counselor"
    })
    .then((response) => {
        const { body, status } = response;
        expect(status).toBe(201);
        expect(body).toHaveProperty("CounselorId");
        expect(body).toHaveProperty("UserId");
        expect(body).toHaveProperty("message");
        done();
    })
    .catch((error) => {
        done(error);
    });
});

test("(400 - Bad Request) Error no message", (done) => {
    request(app)
    .post("/reviews")
    .send({
        "CounselorId": 1,
        "UserId": 1,
    })
    .set({ access_token: access_token_user })
    .then((response) => {
        const { body, status } = response;
        expect(body).toHaveProperty("message");
        expect(status).toBe(400);
        expect(body.message).toEqual(["Message Cannot be null"]);
        done();
    })
    .catch((error) => {
        done(error);
    });
});
});