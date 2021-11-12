const request = require ('supertest')
const app = require('../app.js')
const { sequelize } = require('../models');
const { queryInterface } = sequelize;

const adminRegister = {
  email: "admintest@mail.com",
  password: "admintest",
  role: 'admin',
  name: "admin test",
  gender: "admin gender",
  avatarUrl: "admin image"
};

afterAll((done) => {
  queryInterface.bulkDelete('Users', {})
    .then(() => done())
    .catch((err) => done(err));
});

describe("Admin Routes Test", () => {
  describe('POST /admin/register', () => {
    test('[201 - SUCCESS] Register - Create New Admin', (done) => {
      request(app)
      .post('/admin/register')
      .send(adminRegister)
      .then((response) => {
        const { body, status } = response
        expect(status).toBe(201)
        expect(body).toEqual(expect.any(Object))
        expect(body).toHaveProperty('id', expect.any(Number))
        expect(body).toHaveProperty('email', adminRegister.email)
        done()
      })
      .catch((err) => {
        done(err)
      })
    })
    
    test('[400 - FAILED] Register - Create New Admin with Email is Null', (done) => {
      const payload = {
        password: "admintest",
        role: 'admin',
        name: "admin test",
        gender: "admin gender",
        avatarUrl: "admin image"
      }
      request(app)
      .post('/admin/register')
      .send(payload)
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
  
    test('[400 - FAILED] Register - Create New Admin with Password is Null', (done) => {
      const payload = {
        email: "admintest2@mail.com",
        role: 'admin',
        name: "admin test",
        gender: "admin gender",
        avatarUrl: "admin image"
      }
      request(app)
      .post('/admin/register')
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
  
    test('[400 - FAILED] Register - Create New Admin with Email is an Empty String', (done) => {
      const payload = {
        email: "",
        password: "admintest",
        role: 'admin',
        name: "admin test",
        gender: "admin gender",
        avatarUrl: "admin image"
      }
      request(app)
      .post('/admin/register')
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
  
    test('[400 - FAILED] Register - Create New Admin with Password is an Empty String', (done) => {
      const payload = {
        email: "admintest2@mail.com",
        password: "",
        role: 'admin',
        name: "admin test",
        gender: "admin gender",
        avatarUrl: "admin image"
      }
      request(app)
      .post('/admin/register')
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
  
    test('[400 - FAILED] Register - Create New Admin with an Already-Registered Email', (done) => {
      const payload = {
        email: "admintest@mail.com",
        password: "admintest",
        role: 'admin',
        name: "admin test",
        gender: "admin gender",
        avatarUrl: "admin image"
      }
      request(app)
      .post('/admin/register')
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
  
    test('[400 - FAILED] Register - Create New Admin without using Email Format', (done) => {
      const payload = {
        email: "admintest2mail.com",
        password: "admintest",
        role: 'admin',
        name: "admin test",
        gender: "admin gender",
        avatarUrl: "admin image"
      }
      request(app)
      .post('/admin/register')
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
  
  describe('POST /admin/login', () => {
    test('[200 - SUCCESS] Login - User Authentication Return Access Token', (done) => {
      const adminLogin = {
        email: "admintest@mail.com",
        password: "admintest",
      }
      request(app)
      .post('/admin/login')
      .send(adminLogin)
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
      const adminLogin = {
        email: "admintest3@mail.com",
        password: "admintest",
      }
      request(app)
      .post('/admin/login')
      .send(adminLogin)
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
      const adminLogin = {
        email: "admintest@mail.com",
        password: "admin",
      }
      request(app)
      .post('/admin/login')
      .send(adminLogin)
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
