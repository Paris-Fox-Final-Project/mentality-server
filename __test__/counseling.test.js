const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");
const { Counselor, User, Topic } = require("../models");

beforeEach((done) => {
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

afterEach((done) => {
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
