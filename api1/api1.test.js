// setting up unit tests for API 1 - convert 'model' and 'year' into car value
const app = require('api1')
const request = require('supertest')

describe("API 1 test cases", ()=> {
    test("1. Ideal test: enter 'Starlet', 1998 and return 11498", async () => {
        const response = await request(app)
        .post('/api1')
        .send({ model: 'Starlet', year: 1998 });
        expect(response.text).toBe("The premium estimate for your 1998 Starlet is $11498.")
    });
    test("2. Test model input hybrid char: enter 'ix35', 2013 and return 5313", async () => {
        const response = await request(app)
        .post('/api1')
        .send({ model: 'ix35', year: 2013 });
        expect(response.text).toBe("The premium estimate for your 2013 ix35 is $5313.")
    });
    test("3. Test model input num: enter '404', 1969. Return 1969", async () => {
        const response = await request(app)
        .post('/api1')
        .send({ model: '404', year: 1969 });
        expect(response.text).toBe("The premium estimate for your 1969 404 is $1969.")
    });
    test("4. Test invalid model char: enter 'Santa-Fe', 2012 return error", async () => {
        const response = await request(app)
        .post('/api1')
        .send({ model: 'Santa-Fe', year: 2012 });
        expect(response.status).toBe(400)
    });
    test("5. Test negative year: enter 'Vitz', -2000 return error", async () => {
        const response = await request(app)
        .post('/api1')
        .send({ model: 'Vitz', year: -2000 });
        expect(response.status).toBe(400)
    });
    test("6. Test invalid year input type: enter 'Demio', twenty thirteen return error", async () => {
        const response = await request(app)
        .post('/api1')
        .send({ model: 'Demio', year: 'twenty thirteen' });
        expect(response.status).toBe(400)
    });
})