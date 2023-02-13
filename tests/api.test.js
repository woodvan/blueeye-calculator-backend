const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");

const testuser = {
    firstname: 'firstname',
    lastname: 'lastname',
    email: 'xxx@email.com',
    password: 'password'
};

const getJWTToken = async () => {
    const res = await supertest(app).post("/api/login").send({
        email: testuser.email,
        password: testuser.password
    })
    return res.body.data.accessToken;
};

  
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
    await supertest(app).post("/api/register").send(testuser)
    .expect(200)
    .then((response) => {
        // Check data
        expect(response.body.status).toBe(200);
        expect(response.body.data.firstname).toBe(testuser.firstname);
        expect(response.body.data.lastname).toBe(testuser.lastname);
        expect(response.body.data.email).toBe(testuser.email);
        expect(response.body.data.cost).toBe(100);
        expect(response.body.data.status).toBe('active');
    });
});

test("GET /api/login", async () => {
    const payload = {
        email: testuser.email,
        password: testuser.password
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

test("GET /api/operations without token", async () => {
    await supertest(app).get("/api/operations").send().expect(403)
})

test("GET /api/operations", async () => {
    const token = await getJWTToken();
    await supertest(app)
        .get("/api/operations")
        .set({ Authorization: `Bearer ${token}` })
        .send()
        .expect(200)
});

test("POST /api/request", async () => {
    const token = await getJWTToken();
    const payload = {
        operation: "addition",
        params: {
            param1: 1,
            param2: 2
        }
    }
    await supertest(app)
        .post("/api/request")
        .set({ Authorization: `Bearer ${token}` })
        .send(payload)
        .expect(200)
});

test("GET /api/records", async () => {
    const token = await getJWTToken();
    await supertest(app)
        .post("/api/records")
        .set({ Authorization: `Bearer ${token}` })
        .send()
        .expect(200)
});