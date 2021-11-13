const sha512 = require("js-sha512");
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

  const dummyCounselorUser = {
    CounselorId: 1,
    UserId: 1,
    TopicId: 1,
    description: "Ditinggal pacar",
    isDone: false,
    isPaid: true,
    transactionAmount: 200000,
    schedule: "2021-11-19 21:00:00 +07",
    totalSession: 1,
  };

  const topic = { name: "family " };
  User.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then(() => User.bulkCreate(dummeyUsers))
    .then(() => Counselor.create(dummyCounselor))
    .then(() => Topic.create(topic))
    .then(() => CounselorUser.create(dummyCounselorUser))
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
    .then(() => CounselorUser.destroy(option))
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
        expect(counseling.id).toBe(2); //<------------- dari 1 ke 2

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
        expect(counseling).toHaveProperty("orderId");
        expect(counseling.orderId).toEqual(expect.any(String));
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
      .patch("/counseling/3/done") //<--------------- dari 2 ke 3
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
      .patch("/counseling/4/done") //<------------- dari 3 ke 4
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

describe("PATCH counseling paid status", () => {
  let counselingData = null;
  beforeEach((done) => {
    CounselorUser.findByPk(1)
      .then((data) => {
        counselingData = data;
        done();
      })
      .catch((error) => done(error));
  });

  afterEach((done) => {
    CounselorUser.update({ isPaid: false }, { where: { id: 1 } })
      .then(() => done())
      .catch((error) => done(error));
  });
  test("Payment successful with midtrans", (done) => {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const stringForHash = `${counselingData.orderId}200${counselingData.transactionAmount}${serverKey}`;
    let hash = sha512(stringForHash);
    const payload = {
      order_id: counselingData.orderId,
      gross_amount: counselingData.transactionAmount,
      signature_key: hash,
      status_code: 200,
      transaction_status: "settlement",
    };

    request(app)
      .post("/counseling/midtrans/notification")
      .send(payload)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body.status).toBe("success");
        return CounselorUser.findByPk(1);
      })
      .then((data) => {
        expect(data).toEqual(expect.any(Object));
        expect(data.isPaid).toBe(true);
        done();
      });
  });

  test("Midtrans notification failed - signature key is not valid", (done) => {
    const signature_key =
      "2496c78cac93a70ca08014bdaaff08eb7119ef79ef69c4833d4399cada077147febc1a231992eb8665a7e26d89b1dc323c13f721d21c7485f70bff06cca6eed3";
    const payload = {
      signature_key,
      order_id: "example order",
      gross_amount: 50000,
      transaction_status: "settlement",
      status_code: 200,
    };
    request(app)
      .post("/counseling/midtrans/notification")
      .send(payload)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Failed Signature Key");
        return CounselorUser.findByPk(1);
      })
      .then((data) => {
        expect(data).toEqual(expect.any(Object));
        expect(data.isPaid).toBe(false);
        done();
      });
  });
});
describe("GET /counseling/:counselingId - get counseling detail", () => {
  const falsyToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCCI6MSwiZW1haWwiOiJhZG1pbjFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjM2NjIwODkyfQ.hCoxGBcGWR3b1DiVfTJ9Nz2PpLI3C1D_Sr0jLKlwQPU";
  test("200 - success get counseling detail", (done) => {
    request(app)
      .get("/counseling/1")
      .set({ access_token: token })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("User");
        expect(body).toHaveProperty("CounselorId", expect.any(Number));
        expect(body).toHaveProperty("UserId");
        expect(body).toHaveProperty("isDone");
        expect(body).toHaveProperty("isPaid");
        expect(body).toHaveProperty("transactionAmount");
        expect(body.User).toHaveProperty("email");
        expect(body.User).toHaveProperty("name");
        expect(body.User).toHaveProperty("role");
        done();
      })
      .catch((error) => done(error));
  });

  test("401 Error - failed to get data with invalid token", (done) => {
    request(app)
      .get("/counseling/1")
      .set("access_token", falsyToken)
      .then((response) => {
        const { body, status } = response;
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
      .get("/counseling/1")
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Access Token is Required");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("401 Error - failed to get data counselor not found", (done) => {
    request(app)
      .get("/counseling/99")
      .set("access_token", token)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Counseling Not Found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("GET /counseling/counselor/:counselorId - get all counselor counseling list", () => {
  const falsyToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCCI6MSwiZW1haWwiOiJhZG1pbjFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjM2NjIwODkyfQ.hCoxGBcGWR3b1DiVfTJ9Nz2PpLI3C1D_Sr0jLKlwQPU";
  test("200 - success get counselor counseling list", (done) => {
    request(app)
      .get("/counseling/counselor/1")
      .set({ access_token: token })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(body[0]).toHaveProperty("CounselorId", expect.any(Number));
        expect(body[0]).toHaveProperty("UserId");
        expect(body[0]).toHaveProperty("isDone");
        expect(body[0]).toHaveProperty("isPaid");
        expect(body[0]).toHaveProperty("transactionAmount");
        done();
      })
      .catch((error) => done(error));
  });
  test("401 Error - failed to get counselor counseling list with invalid token", (done) => {
    request(app)
      .get("/counseling/counselor/1")
      .set("access_token", falsyToken)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid Access Token");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("401 Error - failed to get counselor counseling list without token", (done) => {
    request(app)
      .get("/counseling/counselor/1")
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Access Token is Required");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("GET /counseling/user/:userId - get all counselor counseling list", () => {
  const falsyToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCCI6MSwiZW1haWwiOiJhZG1pbjFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjM2NjIwODkyfQ.hCoxGBcGWR3b1DiVfTJ9Nz2PpLI3C1D_Sr0jLKlwQPU";
  test("200 - success get user counseling list", (done) => {
    request(app)
      .get("/counseling/user/1")
      .set({ access_token: token })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(body[0]).toHaveProperty("CounselorId", expect.any(Number));
        expect(body[0]).toHaveProperty("UserId");
        expect(body[0]).toHaveProperty("isDone");
        expect(body[0]).toHaveProperty("isPaid");
        expect(body[0]).toHaveProperty("transactionAmount");
        done();
      })
      .catch((error) => done(error));
  });
  test("401 Error - failed to get user counseling list with invalid token", (done) => {
    request(app)
      .get("/counseling/user/1")
      .set("access_token", falsyToken)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid Access Token");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("401 Error - failed to get user counseling list without token", (done) => {
    request(app)
      .get("/counseling/user/1")
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Access Token is Required");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
