const app = require('../app.js');
const { Topic, sequelize } = require('../models');
const request = require('supertest');
const { queryInterface } = sequelize;

const data = {
  name: "Kesehatan"
}

describe('Topic Routes Test', () => {
  describe('POST /topics - create new topics', (done) => {
    request(app)
      .post("/topics")
      .then((resp) => {
        const { body, status } = resp;
        expect(status).toBe(201);
        expect(body).toHaveProperty("name", "Kesehatan");
        done();
      })
      .catch(err => {
        done(err)
      })
  })

  describe('GET /topics - get topics', () => {
    test("200 success get topics", (done) => {
      request(app)
        .get("/topics")
        .then(resp => {
          const {body, status} = resp
          expect(status).toBe(200);
          expect(Array.isArray(body)).toBeTruthy();
          expect(body.length).toBeGreatherThan(0);
          done();
        })
        .catch(err => {
          done(err)
        })
    })
  })
  
  describe('GET BY ID /topics - get topics by id', () => {
    test("200 get topics by id", (done) => {
      request(app)
        .get(`/topics/${id}`)
        .then(resp => {
          const {body, status} = resp;
          expect(status).toBe(200);
          expect(Array.isArray(body)).toBeTruthy();
          done();
        })
        .catch(err => {
          done(err);
        })
    })
  })

  describe('PUT /topics - edit topics', () => {
    test("200 success to update topics", (done) => {
      request(app)
        .put(`/topics/${id}`)
        .then((resp) => {
          const {body, status} = resp
          expect(status).toBe(200);
          expect(body).toHaveProperty("id", expect.any(Number));
          done();
        })
        .catch(err => {
          done(err);
        })
    })
  })

  describe('DELETE /topics - delete topics', () => {
    test("200 success to delete topics", (done) => {
      request(app)
        .delete(`/topics/${id}`)
        .then(resp => {
          const {body, status} = resp
          expect(status).toBe(200)
          expect(body).toHaveProperty("message", `${foundTopic.name} success to delete`)
          done();
        })
        .catch(err => {
          done(err)
        })
    })
  })
})