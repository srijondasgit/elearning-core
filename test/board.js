let chai = require("chai");
let chaiHttp = require("chai-http")
let server = require("../app.js")


//Assertion style 
chai.should();

chai.use(chaiHttp);

describe ('Auth Api testing' , () => {

    describe("post /auth/register", () => {
        it("It should create a user with SchoolAdmin role", (done) => {
            chai.request('localhost:3001')
                .post("/auth/register")
                .set('Content-Type', 'application/json')
                .send({"name":"testuser", "role": "Admin", "email": "testuser234@testuser.com", "password": "Pass123word"
                })
                .end((err, response) => {
                    currentResponse = response;
                    response.should.have.status(200);
                    response.should.be.json
                done();
                });
        });
    });


    describe("post /auth/verify", () => {
        it("It should verify a user by the passcode", (done) => {
            chai.request('localhost:3001')
                .post("/auth/verify")
                .set('Content-Type', 'application/json')
                .send({"email": "testuser234@testuser.com", "activationcode": "1000"})
                .end((err, response) => {
                    currentResponse = response;
                    response.should.have.status(200);
                done();
                });
        });
    });

    describe("post /auth/login", () => {
        it("It should login a user by the password and generate the JWT token", (done) => {
            chai.request('localhost:3001')
                .post("/auth/login")
                .set('Content-Type', 'application/json')
                .send({"email": "testuser234@testuser.com", "password": "Pass123word"})
                .end((err, response) => {
                    jwtToken = response.text;
                    response.should.have.status(200);
                    console.log(jwtToken)
                done();
                });
        });
    });

    describe("post /board/createBoard", () => {
        it("It should create a board", (done) => {
            chai.request('localhost:3001')
                .post("/board/createBoard")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send({"indx": 1, "boardName": "ksee", "boardDescription": "Karnataka State Board", "governmentId": "some gvt id", "boardVersion": "2021.07.11"})
                .end((err, response) => {
                    boardId = response.body._id;
                    response.should.have.status(200);
                    console.log(boardId)
                done();
                });
        });
    });

    describe("delete /board/", () => {
        it("It should delete a board", (done) => {
            chai.request('localhost:3001')
                .delete("/board/boardid/"+boardId)
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send()
                .end((err, response) => {
                    deleted = response
                    response.should.have.status(200);
                    console.log("err : "+err);
                    console.log("response : "+ JSON.stringify(JSON.parse(JSON.parse(JSON.stringify(response.text))).deletedCount));
                done();
                });
        });
    });

    describe("delete /auth/register", () => {
        it("It should delete a user with Admin role", (done) => {
            chai.request('localhost:3001')
                .delete("/auth/register")
                .set('Content-Type', 'application/json')
                .send({"name":"testuser", "role": "Admin", "email": "testuser234@testuser.com", "password": "Pass123word"
                })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.json;
                done();
                });
        });
    });
});