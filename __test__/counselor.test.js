const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { Counselor, User } = require("../models");
const { generateToken } = require("../helpers/jwt");
const { encodePassword } = require("../helpers/bcrypt");

// seed data admin 1 buat cek token
const admin = {
  email: "admin1@gmail.com",
  password: encodePassword("789456123"),
  role: "Admin",
  name: "user1",
  gender: "Male",
  avatarUrl:
    "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
};
const userTest1 = {
  email: "user1@gmail.com",
  password: encodePassword("789456123"),
  role: "Counselor",
  name: "user1",
  gender: "Male",
  avatarUrl:
    "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
};

const userTest2 = {
  email: "user2@gmail.com",
  password: encodePassword("789456123"),
  role: "Counselor",
  name: "user2",
  gender: "Female",
  avatarUrl:
    "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
};

const createTestCase = {
  email: "testing@gmail.com",
  password: encodePassword("789456123"),
  role: "Counselor",
  name: "testing",
  gender: "Male",
  avatarUrl:
    "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
  motto: "motto",
  specialist: "specialist",
  about: "about",
  price: 200000,
};

beforeAll((done) => {
  User.create(admin)
    .then(() => {
      return User.create(userTest1);
    })
    .then((register1) => {
      return Counselor.create({
        UserId: register1.dataValues.id,
        motto: "motto",
        specialist: "specialist",
        about: "about",
        price: 200000,
      });
    })
    .then(() => {
      return User.create(userTest2);
    })
    .then((register2) => {
      return Counselor.create({
        UserId: register2.dataValues.id,
        motto: "motto",
        specialist: "specialist",
        about: "about",
        price: 250000,
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
      "Users",
      {},
      { truncate: true, cascade: true, restartIdentity: true }
    )
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

describe("Counserlor Routes Test", () => {
  const access_token = generateToken({
    id: 1,
    email: "admin1@gmail.com",
    role: "Admin",
  });
  const falsyToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCCI6MSwiZW1haWwiOiJhZG1pbjFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjM2NjIwODkyfQ.hCoxGBcGWR3b1DiVfTJ9Nz2PpLI3C1D_Sr0jLKlwQPU";

  describe("GET /counselors - get all counselor", () => {
    test("200 Success - should get all counselor", (done) => {
      request(app)
        .get("/counselors")
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(200);
          expect(Array.isArray(body)).toBeTruthy();
          expect(body.length).toBeGreaterThan(0);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    // Kondisi yg error gmn
    test("401 Error - failed to get data with invalid token", (done) => {
      request(app)
        .get("/counselors")
        .set("access_token", falsyToken)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Access Token");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("401 Error - failed to get data without token", (done) => {
      request(app)
        .get("/counselors")
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Access Token is Required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
  describe("GET /counselors/:id - get counselor by id", () => {
    test("200 Success - should get one matching counselor", (done) => {
      request(app)
        .get(`/counselors/${1}`)
        .set({ access_token: access_token })
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(200);
          expect(body).toHaveProperty("id", expect.any(Number));
          expect(body).toHaveProperty("UserId", 6);
          // expect(body).toHaveProperty("id", expect.any(Number));
          expect(body).toHaveProperty("motto");
          expect(body).toHaveProperty("about");
          expect(body).toHaveProperty("price", expect.any(Number));
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    // Kondisi yg error gmn
    test("401 Error - failed to get data with invalid token", (done) => {
      request(app)
        .get(`/counselors/${1}`)
        .set("access_token", falsyToken)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Access Token");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("401 Error - failed to get data without token", (done) => {
      request(app)
        .get(`/counselors/${1}`)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Access Token is Required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("404 Error - failed to get data counselor not found", (done) => {
      request(app)
        .get(`/counselors/${99}`)
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(404);
          expect(body).toHaveProperty("message", "Counselor not found!");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
  describe("POST /counselor - create new counselor", () => {
    test("201 Success create counselor", (done) => {
      request(app)
        .post("/counselors")
        .send(createTestCase)
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(201);
          expect(body.counselor).toHaveProperty("id", expect.any(Number));
          expect(body.counselor).toHaveProperty("email");
          expect(body.counselor).toHaveProperty("role");
          expect(body.counselor).toHaveProperty("name");
          expect(body.counselor).toHaveProperty("gender");
          expect(body.counselor).toHaveProperty("about");
          expect(body.counselor).toHaveProperty("price", expect.any(Number));
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    // Kondisi yg error gmn
    test("401 Failed create counselor invalid token", (done) => {
      request(app)
        .post("/counselors")
        .send(createTestCase)
        .set("access_token", falsyToken)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Access Token");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("401 Failed create counselor without token", (done) => {
      request(app)
        .post("/counselors")
        .send(createTestCase)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Access Token is Required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("400 Failed create counselor email null", (done) => {
      request(app)
        .post("/counselors")
        .send({
          password: encodePassword("789456123"),
          role: "Counselor",
          name: "testing",
          gender: "Male",
          avatarUrl:
            "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
          motto: "motto",
          specialist: "specialist",
          about: "about",
          price: 200000,
        })
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", ["Email cannot be null"]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("400 Failed create counselor email empty", (done) => {
      request(app)
        .post("/counselors")
        .send({
          email: "",
          password: encodePassword("789456123"),
          role: "Counselor",
          name: "testing",
          gender: "Male",
          avatarUrl:
            "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
          motto: "motto",
          specialist: "specialist",
          about: "about",
          price: 200000,
        })
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", [
            "Email is required",
            "Invalid email format",
          ]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("400 Failed create counselor password null", (done) => {
      request(app)
        .post("/counselors")
        .send({
          email: "testing@gmail.com",
          role: "Counselor",
          name: "testing",
          gender: "Male",
          avatarUrl:
            "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
          motto: "motto",
          specialist: "specialist",
          about: "about",
          price: 200000,
        })
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", ["Password cannot be null"]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("400 Failed create counselor pasword empty", (done) => {
      request(app)
        .post("/counselors")
        .send({
          email: "testing@gmail.com",
          password: "",
          role: "Counselor",
          name: "testing",
          gender: "Male",
          avatarUrl:
            "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
          motto: "motto",
          specialist: "specialist",
          about: "about",
          price: 200000,
        })
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '///////////////')
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", ["Password is required"]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("400 Failed create counselor specialist empty", (done) => {
      request(app)
        .post("/counselors")
        .send({
          email: "testing3@gmail.com",
          password: "789456123",
          role: "Counselor",
          name: "testing",
          gender: "Male",
          avatarUrl:
            "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
          motto: "motto",
          specialist: "",
          about: "about",
          price: 200000,
        })
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '///////////////')
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", [
            "Specialist Cannot be Empty",
          ]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("400 Failed create counselor about empty", (done) => {
      request(app)
        .post("/counselors")
        .send({
          email: "testing1@gmail.com",
          password: "789456123",
          role: "Counselor",
          name: "testing",
          gender: "Male",
          avatarUrl:
            "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
          motto: "motto",
          specialist: "specialist",
          about: "",
          price: 200000,
        })
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '///////////////')
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", ["About Cannot be Empty"]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("400 Failed create counselor price lower than 100000", (done) => {
      request(app)
        .post("/counselors")
        .send({
          email: "testing2@gmail.com",
          password: "789456123",
          role: "Counselor",
          name: "testing",
          gender: "Male",
          avatarUrl:
            "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
          motto: "motto",
          specialist: "specialist",
          about: "about",
          price: 10000,
        })
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '///////////////')
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", ["Minimum price is 100000"]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
  describe("PUT/counselors/:id - update counselors field", () => {
    test("200 Success update counselors", (done) => {
      request(app)
        .put(`/counselors/${1}`)
        .send({
          motto: "motto 126",
          specialist: "specialist 123",
          about: "about 123",
          price: 200000,
        })
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(200);
          expect(body).toHaveProperty("message", "Counselor Updated");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    // Kondisi yg error gmn
    test("401 Failed update counselors invalid token", (done) => {
      request(app)
        .post(`/counselors/${1}`)
        .send({
          motto: "motto 126",
          specialist: "specialist 123",
          about: "about 123",
          price: 200000,
        })
        .set("access_token", falsyToken)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Access Token");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("401 Failed update counselor without token", (done) => {
      request(app)
        .post(`/counselors/${1}`)
        .send({
          motto: "motto 126",
          specialist: "specialist 123",
          about: "about 123",
          price: 200000,
        })
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '||||||||||||||||||')
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Access Token is Required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("400 Failed update counselors specialist empty", (done) => {
      request(app)
        .put(`/counselors/${1}`)
        .send({
          motto: "motto 126",
          specialist: "",
          about: "about 123",
          price: 200000,
        })
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          console.log(body, "///////////////");
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", [
            "Specialist Cannot be Empty",
          ]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("400 Failed create counselors about empty", (done) => {
      request(app)
        .put(`/counselors/${1}`)
        .send({
          motto: "motto",
          specialist: "specialist",
          about: "",
          price: 200000,
        })
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '///////////////')
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", ["About Cannot be Empty"]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("400 Failed create counselors price lower than 100000", (done) => {
      request(app)
        .put(`/counselors/${1}`)
        .send({
          motto: "motto",
          specialist: "specialist",
          about: "about",
          price: 10000,
        })
        .set("access_token", access_token)
        .then((response) => {
          const { body, status } = response;
          // console.log(body, '///////////////')
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", ["Minimum price is 100000"]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
