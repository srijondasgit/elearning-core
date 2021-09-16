let chai = require("chai");
let chaiHttp = require("chai-http")
let server = require("../../../app.js")

chai.should();

chai.use(chaiHttp);

//This is testing code for core functionality
describe ('Create board if board does not already exist' , () => {

    describe("post /board/getOneBoardByDescription", () => {
        it("It should get a board when searched by description", (done) => {
            chai.request('localhost:3001')
                .post("/board/getOneBoardByDescription")
                .set('Content-Type', 'application/json')
                .send({"boardName": "ABCD"})
                .end((err, response) => {
                    cbseBoardId = response.body;
                    response.should.have.status(200);
                    console.log(cbseBoardId);
                    if(cbseBoardId==="No boardId found") { console.log("CBSE Board does not exist, creating a new CBSE board entry...")

                    describe("post /auth/register", () => {
                        it("It should create a user with SchoolAdmin role", (done) => {
                            chai.request('localhost:3001')
                                .post("/auth/register")
                                .set('Content-Type', 'application/json')
                                .send({"name":"testuser", "role": "Admin", "email": "testuser500@testuser.com", "password": "Pass123word"
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
                                .send({"email": "testuser500@testuser.com", "activationcode": "1000"})
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
                                .send({"email": "testuser500@testuser.com", "password": "Pass123word"})
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
                                .send({"indx": 1, "boardName": "CBSE", "boardDescription": "CBSE Board content", "governmentId": "NA", "boardVersion": "2021.07.01"})
                                .end((err, response) => {
                                    module.exports.boardId = response.body._id;
                                    response.should.have.status(200);
                                    console.log(this.boardId)
                                done();
                                });
                        });
                    });
                
                    describe("create class /board/boardId/:boardId/addClass", () => {
                        it("It should create a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+this.boardId+"/addClass")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({ "indx": 1, "description": "Class 10"})
                                .end((err, response) => {
                                    this.classId10 = response.body;
                                    response.should.have.status(200);
                                    console.log(this.classId10)
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
                                .send({ "indx": 2, "description": "Class 9"})
                                .end((err, response) => {
                                    classId = response.body;
                                    response.should.have.status(200);
                                    console.log(classId)
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
                                .send({ "indx": 3, "description": "Class 8"})
                                .end((err, response) => {
                                    classId = response.body;
                                    response.should.have.status(200);
                                    console.log(classId)
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
                                .send({ "indx": 4, "description": "Class 7"})
                                .end((err, response) => {
                                    classId = response.body;
                                    response.should.have.status(200);
                                    console.log(classId)
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
                                .send({ "indx": 5, "description": "Class 6"})
                                .end((err, response) => {
                                    classId = response.body;
                                    response.should.have.status(200);
                                    console.log(classId)
                                done();
                                });
                        });
                    });


                    describe("delete /auth/register", () => {
                        it("It should delete a user with Admin role", (done) => {
                            chai.request('localhost:3001')
                                .delete("/auth/register")
                                .set('Content-Type', 'application/json')
                                .send({"name":"testuser", "role": "Admin", "email": "testuser500@testuser.com", "password": "Pass123word"
                                })
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.should.be.json;
                                done();
                                });
                        });
                    });

                
                    }
                    else {
                    
                     console.log("CBSE Board entry already exists, aborting data creation")

                    }
                done();
                });
        });
    }); 




});