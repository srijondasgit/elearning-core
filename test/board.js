let chai = require("chai");
let chaiHttp = require("chai-http")
let server = require("../app.js")

chai.should();

chai.use(chaiHttp);

describe ('Board Api testing' , () => {

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

    describe("create class /board/boardId/:boardId/addClass", () => {
        it("It should create a class", (done) => {
            chai.request('localhost:3001')
                .patch("/board/boardId/"+boardId+"/addClass")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send({ "indx": 1, "description": "Class 10"})
                .end((err, response) => {
                    classId = response.body;
                    response.should.have.status(200);
                    console.log(classId)
                done();
                });
        });
    });

    describe("create another class /board/boardId/:boardId/addClass", () => {
        it("It should create another class", (done) => {
            chai.request('localhost:3001')
                .patch("/board/boardId/"+boardId+"/addClass")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send({ "indx": 2, "description": "Class 9"})
                .end((err, response) => {
                    classId = response.body;
                    response.should.have.status(200);
                    console.log(classId)
                done();
                });
        });
    });

    describe("get class details using board and classid", () => {
        it("It should get the class", (done) => {
            chai.request('localhost:3001')
                .get("/board/boardId/"+boardId+"/classId/"+classId+"/getClass")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send()
                .end((err, response) => {
                    response.should.have.status(200);
                    console.log(response.body)
                done();
                });
        });
    });

    describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
        it("It should add a subject to a class", (done) => {
            chai.request('localhost:3001')
                .patch("/board/boardId/"+boardId+"/classId/"+classId+"/addSubject")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send({"indx": 1, "subjectName": "Social Science"})
                .end((err, response) => {
                    response.should.have.status(200);
                    console.log(response.body)
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