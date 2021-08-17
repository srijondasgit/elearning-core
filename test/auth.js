let chai = require("chai");
let chaiHttp = require("chai-http")
let server = require("../app.js")


//Assertion style 
chai.should();

chai.use(chaiHttp);

describe ('Tasks Api' , () => {

    describe("get /getAllBoards", () => {
        it("It should get the board", (done) => {
            chai.request('localhost:3001')
                .get("/board/getAllBoards")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.text.should.contain('boardName')
                done();
                });
        });
    });

    describe("post /auth/register", () => {
        it("It should create a user with SchoolAdmin role", (done) => {
            chai.request('localhost:3001')
                .post("/auth/register")
                .set('Content-Type', 'application/json')
                .send({"name":"testuser", "role": "Admin", "email": "testuser456@testuser.com", "password": "Pass123word"
                })
                .end((err, response) => {
                    currentResponse = response;
                    response.should.have.status(200);
                    response.should.be.json
                done();
                });
        });
    });


    describe("delete /auth/register", () => {
        it("It should delete a user with SchoolAdmin role", (done) => {
            chai.request('localhost:3001')
                .delete("/auth/register")
                .set('Content-Type', 'application/json')
                .send({"name":"testuser", "role": "Admin", "email": "testuser456@testuser.com", "password": "Pass123word"})
                .end((err, response) => {
                    currentResponse = response;
                    response.should.have.status(200);
                    response.should.be.json
                done();
                });
        });
    });
});