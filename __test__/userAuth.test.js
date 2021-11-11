const request = require ('supertest')
const app = require('../app.js')
const { sequelize } = require('../models');
const { queryInterface } = sequelize;

const userRegister = {
  email: "usertest@mail.com",
  password: "usertest",
  name: "user test",
  gender: "user gender",
  avatarUrl: "user image"
};

afterAll((done) => {
  queryInterface.bulkDelete('Users', {})
    .then(() => done())
    .catch((err) => done(err));
});


describe.skip("User Routes Test", () => {
  describe('POST /register', () => {
    test('[201 - SUCCESS] Register - Create New User', (done) => {
      request(app)
      .post('/register')
      .send(userRegister)
      .then((response) => {
        const { body, status } = response
        expect(status).toBe(201)
        expect(body).toEqual(expect.any(Object))
        expect(body).toHaveProperty('id', expect.any(Number))
        expect(body).toHaveProperty('email', userRegister.email)
        done()
      })
      .catch((err) => {
        done(err)
      })
    })
    
    test('[400 - FAILED] Register - Create New User with Email is Null', (done) => {
      const userRegister = {
        password: "usertest",
        name: "user test",
        gender: "user gender",
        avatarUrl: "user image"
      }
      request(app)
      .post('/register')
      .send(userRegister)
      .then((response) => {
        const { body, status } = response
        expect(status).toBe(400)
        expect(body).toEqual(expect.any(Object))
        expect(body).toHaveProperty('message', ['Email cannot be null'])
        done()
      })
      .catch((err) => {
        done(err)
      })
    })
  
    test('[400 - FAILED] Register - Create New User with Password is Null', (done) => {
      const payload = {
        email: "usertest2@mail.com",
        name: "user test",
        gender: "user gender",
        avatarUrl: "user image"
      }
      request(app)
      .post('/register')
      .send(payload)
      .then((response) => {
        const { body, status } = response
        expect(status).toBe(400)
        expect(body).toEqual(expect.any(Object))
        expect(body).toHaveProperty('message', ['Password cannot be null'])
        done()
      })
      .catch((err) => {
        done(err)
      })
    })
  
    test('[400 - FAILED] Register - Create New User with Email is an Empty String', (done) => {
      const payload = {
        email: "",
        password: "usertest",
        name: "user test",
        gender: "user gender",
        avatarUrl: "user image"
      }
      request(app)
      .post('/register')
      .send(payload)
      .then((response) => {
        const { body, status } = response
        expect(status).toBe(400)
        expect(body).toEqual(expect.any(Object))
        expect(body).toHaveProperty('message', ['Email is required', "Invalid email format"])
        done()
      })
      .catch((err) => {
        done(err)
      })
    })
  
    test('[400 - FAILED] Register - Create New User with Password is an Empty String', (done) => {
      const payload = {
        email: "usertest2@mail.com",
        password: "",
        name: "user test",
        gender: "user gender",
        avatarUrl: "user image"
      }
      request(app)
      .post('/register')
      .send(payload)
      .then((response) => {
        const { body, status } = response
        expect(status).toBe(400)
        expect(body).toEqual(expect.any(Object))
        expect(body).toHaveProperty('message', ['Password is required'])
        done()
      })
      .catch((err) => {
        done(err)
      })
    })
  
    test('[400 - FAILED] Register - Create New User with an Already-Registered Email', (done) => {
      const payload = {
        email: "usertest@mail.com",
        password: "usertest",
        name: "user test",
        gender: "user gender",
        avatarUrl: "user image"
      }
      request(app)
      .post('/register')
      .send(payload)
      .then((response) => {
        const { body, status } = response
        expect(status).toBe(400)
        expect(body).toEqual(expect.any(Object))
        expect(body).toHaveProperty('message', 'Email is already exist')
        done()
      })
      .catch((err) => {
        done(err)
      })
    })
  
    test('[400 - FAILED] Register - Create New User without using Email Format', (done) => {
      const payload = {
        email: "usertest2mail.com",
        password: "usertest",
        name: "user test",
        gender: "user gender",
        avatarUrl: "user image"
      }
      request(app)
      .post('/register')
      .send(payload)
      .then((response) => {
        const { body, status } = response
        expect(status).toBe(400)
        expect(body).toEqual(expect.any(Object))
        expect(body).toHaveProperty('message', ['Invalid email format'])
        done()
      })
      .catch((err) => {
        done(err)
      })
    })
  })
  
  describe('POST /login', () => {
    test('[200 - SUCCESS] Login - User Authentication Return Access Token', (done) => {
      const userLogin = {
        email: "usertest@mail.com",
        password: "usertest",
      }
      request(app)
      .post('/login')
      .send(userLogin)
      .then((response) => {
        console.log(response.body, "<<<< RESPONSE BODY")
        const { body, status } = response
        expect(status).toBe(200)
        expect(body).toEqual(expect.any(Object))
        expect(body).toHaveProperty('access_token', expect.any(String))
        done()
      })
      .catch((err) => {
        console.log(err)
        done(err)
      })
    })
  
    test('[401 - FAILED] Login - User Authentication with Not-Registered Email', (done) => {
      const userLogin = {
        email: "usertest2@mail.com",
        password: "user",
      }
      request(app)
      .post('/login')
      .send(userLogin)
      .then((response) => {
        const { body, status } = response
        expect(status).toBe(401)
        expect(body).toEqual(expect.any(Object))
        expect(body).toHaveProperty('message', 'Invalid Email/Password')
        done()
      })
      .catch((err) => {
        done(err)
      })
    })
  
    test('401 - FAILED] Login - User Authentication with Wrong Password', (done) => {
      const userLogin = {
        email: "usertest@mail.com",
        password: "user",
      }
      request(app)
      .post('/login')
      .send(userLogin)
      .then((response) => {
        const { body, status } = response
        expect(status).toBe(401)
        expect(body).toEqual(expect.any(Object))
        expect(body).toHaveProperty('message', 'Invalid Email/Password')
        done()
      })
      .catch((err) => {
        done(err)
      })
    })
  })
})
