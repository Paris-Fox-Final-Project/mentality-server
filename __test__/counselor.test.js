const app = require("../app");
const request = require("supertest");
const {sequelize} = require("../models");
const { queryInterface } = sequelize;
const {Counselor,User} = require("../models");

const userTest1 = {
    email: "user1@gmail.com",
    password: "789456123",
    role: "Counselor",
    name: "user1",
    gender: "Male",
    avatarUrl: "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
}

const userTest2 = {
    email: "user2@gmail.com",
    password: "789456123",
    role: "Counselor",
    name: "user2",
    gender: "Female",
    avatarUrl: "https://images.unsplash.com/photo-1636429970501-433ac2ff2f4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
}

beforeAll((done) => {
    User.create(userTest1)
    .then((register1)=>{
        return Counselor.create({
            UserId: register1.dataValues.id,
            motto: "motto",
            specialist:"specialist",
            about:"about",
            price:200000
        })
    })
    .then(()=>{
        return User.create(userTest2)
    })
    .then((register2)=>{
        return Counselor.create({
            UserId: register2.dataValues.id,
            motto: "motto",
            specialist:"specialist",
            about:"about",
            price:250000
        })
    })
    .then(()=>{
        done()
    })
    .catch((err)=>{
        done(err)
    })
});

afterAll((done) => {
    queryInterface.bulkDelete('Users', {})
      .then(() => {
        return queryInterface.bulkDelete('Counselors', {});
      })
      .then(() => done())
      .catch((err) => done(err));
  });


describe("Counserlor Routes Test", ()=>{
    describe("GET /counselor - get all counselor",  ()=>{
        test("200 Success - should get all counselor", (done)=>{
            request(app)
            .get("/counselor")
            // .set("access_token")
            .then((response)=>{
                const { body, status } = response;
                console.log(body, '||||||||||||||||||')
                expect(status).toBe(200);
                expect(Array.isArray(body)).toBeTruthy();
                expect(body.length).toBeGreaterThan(0);
                done();
            })
            .catch((err)=>{
                done(err)
            })
        })
        // Kondisi yg error gmn
        
    })
    describe("GET /counselor/:id - get counselor by id",  ()=>{
        // test("200 Success - should get one matching counselor", (done)=>{

        // })
        // Kondisi yg error gmn
    })
    describe("POST /counselor - create new counselor",  ()=>{
        // test("201 Success create counselor", (done)=>{

        // })
        // Kondisi yg error gmn
    })
    describe("PUT/counselor - update counselor field",  ()=>{
        // test("200 Success update counselor", (done)=>{

        // })
        // Kondisi yg error gmn
    })
})