const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");
const {
  Counselor,
  User,
  Topic,
  sequelize,
  CounselorUser,
} = require("../models");
const { queryInterface } = sequelize;

beforeAll((done) => {
  const dummyCounselor = {
    UserId: 2,
    motto: "Stay foolish, stay hungry",
    about: "A counselor",
    price: 195000,
    specialist: "Family",
  };

  const dummeyUsers = [
    {
      name: "John Doe",
      gender: "L",
      email: "johndoe@mail.com",
      avatar_url: null,
      password: "exmaple password",
      role: "patient",
    },
    {
      name: "Vivi",
      gender: "P",
      role: "counselor",
      avatar_url: null,
      password: "example password",
      email: "vivicounselor@mail.com",
    },
  ];

  const topic = { name: "family " };
  User.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then(() => User.bulkCreate(dummeyUsers))
    .then(() => Counselor.create(dummyCounselor))
    .then(() => Topic.create(topic))
    .then(() => done())
    .catch((error) => done(error));
});

afterAll((done) => {
  const option = {
    restartIdentity: true,
    truncate: true,
    cascade: true,
  };
  Counselor.destroy(option)
    .then(() => User.destroy(option))
    .then(() => Topic.destroy(option))
    .then(() => done())
    .catch((error) => done(error));
});

const token = generateToken({
  email: "johndoe@mail.com",
  id: 1,
  role: "user",
});

describe("POST /counseling - create counseling schedule", () => {
  test("(201 - OK) Create New Schedule for Counseling", (done) => {
    const payload = {
      CounselorId: 1,
      description: "Example description",
      TopicId: 1,
      schedule: `2021-11-19 10:00`,
      totalSession: 2,
    };
    request(app)
      .post("/counseling")
      .send(payload)
      .set({ access_token: token })
      .then((response) => {
        const { body } = response;
        expect(body).toHaveProperty("counseling");
        expect(body.counseling).toEqual(expect.any(Object));
        const { counseling } = body;
        expect(counseling).toHaveProperty("id");
        expect(counseling.id).toBe(1);

        expect(counseling).toHaveProperty("transactionAmount");
        expect(counseling).toHaveProperty("Counselor");

        const value = counseling.totalSession * counseling.Counselor.price;
        expect(counseling.transactionAmount).toBe(value);

        expect(counseling).toHaveProperty("isDone");
        expect(counseling.isDone).toBe(false);
        expect(counseling).toHaveProperty("isPaid");
        expect(counseling.isPaid).toBe(false);

        const { Counselor } = counseling;
        expect(Counselor).toHaveProperty("User");
        expect(Counselor.User.name).toBe("Vivi");

        expect(counseling).toHaveProperty("transaction");
        done();
      })
      .catch((error) => done(error));
  });
  test("(400- Bad Request) Failed Create New Schedule for Counseling because schedule is not valid", (done) => {
    const payload = {
      CounselorId: 1,
      description: "Example description",
      TopicId: 1,
      schedule: `2021-11-9 10:00`,
      totalSession: 2,
    };
    request(app)
      .post("/register")
      .send(payload)
      .set({ access_token: token })
      .then((response) => {
        const { body, status } = response;
        expect(body).toHaveProperty("message");
        expect(body).toEqual(expect.not.objectContaining({ counseling: {} }));
        expect(status).toBe(400);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  test("(400 - Bad Request) Failed Create New Schedule for Counseling because CounselorId not found", (done) => {
    const payload = {
      CounselorId: 100,
      description: "Example description",
      TopicId: 1,
      schedule: `2021-11-9 10:00`,
      totalSession: 2,
    };
    request(app)
      .post("/counseling")
      .set({ access_token: token })
      .send(payload)
      .then((response) => {
        const { body, status } = response;
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Counselor not found!");
        expect(status).toBe(404);
        done();
      })
      .catch((error) => done(error));
  });
});

describe("PATCH /counseling/:conselingId/done", () => {
  const dummies = [
    {
      CounselorId: 1,
      transactionAmount: 195000,
      UserId: 1,
      schedule: "2021-11-11 15:00:00+07",
      isPaid: true,
      totalSession: 1,
      description: "example of description",
      TopicId: 1,
      isDone: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      CounselorId: 1,
      transactionAmount: 195000,
      UserId: 1,
      schedule: "2021-11-15 16:00:00+07",
      isPaid: true,
      totalSession: 1,
      description: "example of description",
      TopicId: 1,
      isDone: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  beforeAll((done) => {
    queryInterface
      .bulkInsert("CounselorUsers", dummies)
      .then((data) => {
        done();
      })
      .catch((error) => done(error));
  });
  test("(400 - Bad Request) failed because counseling not paid", (done) => {
    request(app)
      .patch("/counseling/1/done")
      .set({ access_token: token })
      .then((response) => {
        const { body, status } = response;
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Sorry, counseling hasn't not paid yet");
        expect(status).toBe(400);
        done();
      });
  });
  test("(200 - Success) Counseling is done", (done) => {
    request(app)
      .patch("/counseling/2/done")
      .set({ access_token: token })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(body).toEqual(expect.any(Object));
        expect(body).toHaveProperty("counseling");
        expect(body.counseling).toHaveProperty("id");
        expect(body.counseling).toHaveProperty("isDone");
        expect(body.counseling.isDone).toBe(true);
        done();
      })
      .catch((error) => done(error));
  });
  test("(400-Bad Request) failed because it's not time", (done) => {
    request(app)
      .patch("/counseling/3/done")
      .set({ access_token: token })
      .then((response) => {
        const { body, status } = response;
        expect(body).toEqual(expect.any(Object));
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Sorry, counseling hasn't started yet");
        expect(status).toBe(400);
        done();
      })
      .catch((error) => done(error));
  });
});
