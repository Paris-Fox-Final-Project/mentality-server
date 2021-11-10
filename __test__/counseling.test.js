const request = require("supertest");
const app = require("../app");
const { Counselor, User, Topic } = require("../models");

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
  User.bulkCreate(dummeyUsers)
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
    .then(() => done())
    .catch((error) => done(error));
});

describe("POST /counseling - create counseling schedule", () => {
  const payload = {
    CounselorId: 1,
    description: "Example description",
    TopicId: 1,
    schedule: new Date(),
  };
  test("201 counseling schedule successful created", (done) => {
    request(app)
      .post("/counseling")
      .send(payload)
      .then((response) => {
        const { body } = response;
        expect(body).toHaveProperty("counseling");
        expect(body.counseling).toEqual(expect.any(Object));

        const { counseling } = body;
        expect(counseling).toHaveProperty("id");
        expect(counseling.id).toBe(1);

        expect(counseling).toHaveProperty("transactionAmount");
        expect(counseling).toHaveProperty("Counselor");
        expect(counseling.transactionAmount).toBe(counseling.Counselor.price);

        expect(counseling).toHaveProperty("isDone");
        expect(counseling.isDone).toBe(false);
        expect(counseling).toHaveProperty("isPaid");
        expect(counseling.isPaid).toBe(false);
        expect(counseling).toHaveProperty("isActive");
        expect(counseling.isActive).toBe(false);
        done();
      })
      .catch((error) => done(error));
  });
});
