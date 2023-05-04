const { app, PORT } = require('../index');
const req = require('supertest');
const axios = require('axios')

describe('PORT', () => {
    it('PORT is a number', () => {
        expect(typeof PORT).toBe('number');
    });

    it('PORT is 8000 on development', () => {
        expect(PORT).toBe(8000);
    });
});

// Home test 
describe('GET /', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
});

describe('GET /capsules', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/capsules')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/capsules')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /capsules/*', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/capsules/*')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/capsules/*')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
    it('Serial Value should return true as a boolean', () => {
        //console.log('app', app);
        axios.get('http://localhost:8000/capsules/serial/C103')
            .then(function (response) {
                let serialValue = response.data.capsule.serial;
                //console.log('Serial Value -> ', serialValue);
                expect(Boolean(serialValue)).toBe(true);
            })
            .catch(function (error) {
                console.log('error here', error);
            })
    });
    it('Serial Value should return false as a boolean', () => {
        //console.log('app', app);
        axios.get('http://localhost:8000/capsules/serial/c99')
            .then(function (response) {
                console.log('Response Data', response.data);
                expect(response.data.message).toBe('Capsule is not found... Please try again.')
                //let capsuleLength = response.data.capsules.length;
                //console.log('Capsule Length -> ', capsuleLength);
                //expect(Boolean(capsuleLength)).toBe(false);
            })
            .catch(function (error) {
                expect(response).toBe('Capsule is not found... Please try again.')
            })
    })
})

describe('GET /company', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/company')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/company')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /cores', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/cores')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/cores')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /cores/*', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/cores/*')
            .expect(200, done);
    });

    it('should respond with json', () => {
        req(app)
            .get('/cores/*')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
    });

    it('Serial Value should return true as a boolean', () => {
        axios.get('http://localhost:8000/cores/serial/B1037')
            .then(function (response) {
                let serialValue = response.data.core.serial;
                expect(Boolean(serialValue)).toBe(true);
            })
            .catch(function (error) {
                console.log('error here', error);
            })
    });
    it('Serial Value should return false as a boolean', () => {
        axios.get('http://localhost:8000/cores/serial/B37')
            .then(function (response) {
                console.log('Response Data', response.data);
                expect(response.data.message).toBe('Cores is not found... Please try again.')
            })
            .catch(function (error) {
                expect(response).toBe('Cores is not found... Please try again.')
            })
    })
})

describe('GET /crew', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/crew')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/crew')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /dragons', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/dragons')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/dragons')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /dragons/*', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/dragons/*')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/dragons/*')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
    });
    it('ID Value should return true as a boolean', () => {
        axios.get('http://localhost:8000/dragons/id/5e9d058859b1ffd8e2ad5f90')
            .then(function (response) {
                let idValue = response.data.dragon.id;
                expect(Boolean(idValue)).toBe(true);
            })
            .catch(function (error) {
                console.log('error here', error);
            })
    });
    it('ID Value should return false as a boolean', () => {
        axios.get('http://localhost:8000/dragons/id/5e9d058')
            .then(function (response) {
                console.log('Response Data', response.data);
                expect(response.data.message).toBe('Dragons is not found... Please try again.')
            })
            .catch(function (error) {
                expect(response).toBe('Dragons is not found... Please try again.')
            })
    })
})

describe('GET /landpads', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/landpads')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/landpads')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /landpads/*', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/landpads/*')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/landpads/*')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
    });
    it('ID Value should return true as a boolean', () => {
        axios.get('http://localhost:8000/landpads/id/5e9e3033383ecb075134e7cd')
            .then(function (response) {
                let idValue = response.data.landpad.id;
                expect(Boolean(idValue)).toBe(true);
            })
            .catch(function (error) {
                console.log('error here', error);
            })
    });
    it('ID Value should return false as a boolean', () => {
        axios.get('http://localhost:8000/landpads/id/5e9d058')
            .then(function (response) {
                console.log('Response Data', response.data);
                expect(response.data.message).toBe('Landpads is not found... Please try again.')
            })
            .catch(function (error) {
                expect(response).toBe('Landpads is not found... Please try again.')
            })
    })
})

describe('GET /launches', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/launches')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/launches')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /launches/*', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/launches/*')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/launches/*')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
    });
    it('Flight_number Value should return a number', () => {
        axios.get('http://localhost:8000/launches/flight_number/1')
            .then(function (response) {
                let flightNumberValue = response.data.launche.flight_number;
                expect(Number(flightNumberValue)).toBe(true);
            })
            .catch(function (error) {
                console.log('error here', error);
            })
    });
    it('Flight_number Value should not return a string', () => {
        axios.get('http://localhost:8000/launches/flight_number/00')
            .then(function (response) {
                console.log('Response Data', response.data);
                expect(response.data.message).toBe('Launches is not found... Please try again.')
            })
            .catch(function (error) {
                expect(response).toBe('launches is not found... Please try again.')
            })
    })
})

describe('GET /launchpads', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/launchpads')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/launchpads')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /launchpads/*', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/launchpads/*')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/launchpads/*')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
    });
    it('ID Value should return true as a boolean', () => {
        axios.get('http://localhost:8000/launchpads/id/5e9e4502f509094188566f88')
            .then(function (response) {
                let idValue = response.data.launchpad.id;
                expect(Boolean(idValue)).toBe(true);
            })
            .catch(function (error) {
                console.log('error here', error);
            })
    });
    it('ID Value should return false as a boolean', () => {
        axios.get('http://localhost:8000/launchpads/id/5e9e4502f50909')
            .then(function (response) {
                console.log('Response Data', response.data);
                expect(response.data.message).toBe('Launchpads is not found... Please try again.')
            })
            .catch(function (error) {
                expect(response).toBe('Launchpads is not found... Please try again.')
            })
    })
})

describe('GET /payloads', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/payloads')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/payloads')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /roadster', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/roadster')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/roadster')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /rockets', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/rockets')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/rockets')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /ships', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/ships')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/ships')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /starlink', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/starlink')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/starlink')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})

describe('GET /history', () => {
    it('respond with 200', (done) => {
        req(app)
            .get('/history')
            .expect(200, done);
    });
    it('should respond with json', () => {
        req(app)
            .get('/history')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        //.expect(200, done);
    });
})