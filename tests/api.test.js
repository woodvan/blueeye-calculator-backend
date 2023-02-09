const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");

beforeAll((done) => {
  mongoose.connect(process.env.DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });
});

test("GET /api/register", async () => {
    const payload = {
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'test123@email.com',
        password: 'password'
    }
    await supertest(app).post("/api/register").send(payload)
    .expect(200)
    .then((response) => {
        // Check data
        expect(response.body.status).toBe(200);
        expect(response.body.data.firstname).toBe(payload.firstname);
        expect(response.body.data.lastname).toBe(payload.lastname);
        expect(response.body.data.email).toBe(payload.email);
        expect(response.body.data.cost).toBe(100);
        expect(response.body.data.status).toBe('active');
    });
});

test("GET /api/login", async () => {
    const payload = {
        email: 'test123@email.com',
        password: 'password'
    }
    await supertest(app).post("/api/login").send(payload)
    .expect(200)
    .then((response) => {
        // Check data
        expect(response.body).toHaveProperty('status');
        expect(response.body.data).toHaveProperty('user');
        expect(response.body.data).toHaveProperty('accessToken');
        expect(response.body.data).toHaveProperty('refreshToken');
        
        expect(response.body.status).toBe(200);
    });
});