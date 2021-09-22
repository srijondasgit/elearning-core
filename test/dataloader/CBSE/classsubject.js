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
                                    dpBoardId = response.body._id;
                                    module.exports.dpBoardId = dpBoardId;
                                    response.should.have.status(200);
                                    console.log(dpBoardId)
                                done();
                                });
                        });
                    });
                
                    // Create Class 10
                    describe("create class /board/boardId/:boardId/addClass", () => {
                        it("It should create a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+dpBoardId+"/addClass")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({ "indx": 1, "description": "Class 10"})
                                .end((err, response) => {
                                    classId10 = response.body;
                                    response.should.have.status(200);
                                    console.log(classId10)
                                done();
                                });
                        });
                    });

                    //add subject - Class 10 Social Science
                    describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
                        it("It should add a subject to a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+dpBoardId+"/classId/"+classId10+"/addSubject")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({"indx": 1, "subjectName": "Social Science"})
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    dpC10SubSs = response.body;
                                    console.log("Class 10 - Social science subject id : ");
                                    console.log(dpC10SubSs)
                                done();
                                });
                        });
                    });

                    //add subject - Class 10 Science
                    describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
                        it("It should add a subject to a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+dpBoardId+"/classId/"+classId10+"/addSubject")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({"indx": 2, "subjectName": "Science"})
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    dpC10SubSc = response.body;
                                    console.log("Class 10 - Science subject id : ");
                                    console.log(dpC10SubSc)
                                done();
                                });
                        });
                    });

                    //add subject - Class 10 English
                    describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
                        it("It should add a subject to a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+dpBoardId+"/classId/"+classId10+"/addSubject")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({"indx": 3, "subjectName": "English"})
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    dpC10SubEn = response.body;
                                    console.log("Class 10 - English subject id : ");
                                    console.log(dpC10SubEn)
                                done();
                                });
                        });
                    });

                    //add class 9
                    describe("create class /board/boardId/:boardId/addClass", () => {
                        it("It should create a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+dpBoardId+"/addClass")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({ "indx": 3, "description": "Class 9"})
                                .end((err, response) => {
                                    classId09 = response.body;
                                    // module.exports = {classId8}
                                    response.should.have.status(200);
                                    console.log(classId09)
                                done();
                                });
                        });
                    });

                    //add subject - Class 9 Social Science
                    describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
                        it("It should add a subject to a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+dpBoardId+"/classId/"+classId09+"/addSubject")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({"indx": 1, "subjectName": "Social Science"})
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    dpC09SubSs = response.body;
                                    console.log("Class 9 - Social science subject id : ");
                                    console.log(dpC09SubSs)
                                done();
                                });
                        });
                    });

                    //add subject - Class 9 Science
                    describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
                        it("It should add a subject to a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+dpBoardId+"/classId/"+classId09+"/addSubject")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({"indx": 2, "subjectName": "Science"})
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    dpC09SubSc = response.body;
                                    console.log("Class 9 - Science subject id : ");
                                    console.log(dpC09SubSc)
                                done();
                                });
                        });
                    });

                    //add subject - Class 9 English
                    describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
                        it("It should add a subject to a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+dpBoardId+"/classId/"+classId09+"/addSubject")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({"indx": 3, "subjectName": "English"})
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    dpC09SubEn = response.body;
                                    console.log("Class 9 - English subject id : ");
                                    console.log(dpC09SubEn)
                                done();
                                });
                        });
                    });

                //add class 8
                    describe("create class /board/boardId/:boardId/addClass", () => {
                        it("It should create a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+dpBoardId+"/addClass")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({ "indx": 3, "description": "Class 8"})
                                .end((err, response) => {
                                    classId8 = response.body;
                                    // module.exports = {classId8}
                                    response.should.have.status(200);
                                    console.log(classId8)
                                done();
                                });
                        });
                    });

                      //add subject - Class 8 Social Science
                      describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
                        it("It should add a subject to a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+dpBoardId+"/classId/"+classId8+"/addSubject")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({"indx": 1, "subjectName": "Social Science"})
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    dpC8SubSs = response.body;
                                    console.log("Class 8 - Social science subject id : ");
                                    console.log(dpC8SubSs)
                                done();
                                });
                        });
                    });


                     //add subject - Class 8 Science
                     describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
                        it("It should add a subject to a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+dpBoardId+"/classId/"+classId8+"/addSubject")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({"indx": 2, "subjectName": "Science"})
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    dpC8SubSc = response.body;
                                    console.log("Class 8 - Science subject id : ");
                                    console.log(dpC8SubSc)
                                done();
                                });
                        });
                    });



 //add subject - Class 8 English
 describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
    it("It should add a subject to a class", (done) => {
        chai.request('localhost:3001')
            .patch("/board/boardId/"+dpBoardId+"/classId/"+classId8+"/addSubject")
            .set('Content-Type', 'application/json')
            .set('auth-token', jwtToken)
            .send({"indx": 3, "subjectName": "English"})
            .end((err, response) => {
                response.should.have.status(200);
                dpC8SubEn = response.body;
                console.log("Class 8 - English subject id : ");
                console.log(dpC8SubEn)
            done();
            });
    });
});


    // add class 7

    describe("create class /board/boardId/:boardId/addClass", () => {
         it("It should create a class", (done) => {
                chai.request('localhost:3001')
                    .patch("/board/boardId/"+dpBoardId+"/addClass")
                    .set('Content-Type', 'application/json')
                    .set('auth-token', jwtToken)
                    .send({ "indx": 4, "description": "Class 7"})
                    .end((err, response) => {
                         classId7 = response.body;
                         //module.exports = {classId7}
                        response.should.have.status(200);
                         console.log(classId7)
                        done();
                    });
        });
    });

                    //add subject - Class 7 Social Science
describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
    it("It should add a subject to a class", (done) => {
        chai.request('localhost:3001')
            .patch("/board/boardId/"+dpBoardId+"/classId/"+classId7+"/addSubject")
            .set('Content-Type', 'application/json')
            .set('auth-token', jwtToken)
            .send({"indx": 1, "subjectName": "Social Science"})
            .end((err, response) => {
                response.should.have.status(200);
                dpC7SubSs = response.body;
                console.log("Class 7 - Social science subject id : ");
                console.log(dpC7SubSs)
            done();
            });
    });
});


 //add subject - Class 7 Science
 describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
    it("It should add a subject to a class", (done) => {
        chai.request('localhost:3001')
            .patch("/board/boardId/"+dpBoardId+"/classId/"+classId7+"/addSubject")
            .set('Content-Type', 'application/json')
            .set('auth-token', jwtToken)
            .send({"indx": 2, "subjectName": "Science"})
            .end((err, response) => {
                response.should.have.status(200);
                dpC7SubSc = response.body;
                console.log("Class 7 - Science subject id : ");
                console.log(dpC7SubSc)
            done();
            });
    });
});

 //add subject - Class 7 English
 describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
    it("It should add a subject to a class", (done) => {
        chai.request('localhost:3001')
            .patch("/board/boardId/"+dpBoardId+"/classId/"+classId7+"/addSubject")
            .set('Content-Type', 'application/json')
            .set('auth-token', jwtToken)
            .send({"indx": 3, "subjectName": "English"})
            .end((err, response) => {
                response.should.have.status(200);
                dpC7SubEn = response.body;
                console.log("Class 7 - English subject id : ");
                console.log(dpC7SubEn)
            done();
            });
    });
});


                    describe("create class /board/boardId/:boardId/addClass", () => {
                        it("It should create a class", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+dpBoardId+"/addClass")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({ "indx": 5, "description": "Class 6"})
                                .end((err, response) => {
                                    classId6 = response.body;
                                    //module.exports = { dpBoardId, classId10, classId9, classId8, classId7, classId6}
                                    response.should.have.status(200);
                                    console.log(classId6)
                                done();
                                });
                        });
                    });

   //add subject - Class 6 Social Science
   describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
    it("It should add a subject to a class", (done) => {
        chai.request('localhost:3001')
            .patch("/board/boardId/"+dpBoardId+"/classId/"+classId6+"/addSubject")
            .set('Content-Type', 'application/json')
            .set('auth-token', jwtToken)
            .send({"indx": 1, "subjectName": "Social Science"})
            .end((err, response) => {
                response.should.have.status(200);
                dpC6SubSs = response.body;
                console.log("Class 6 - Social science subject id : ");
                console.log(dpC6SubSs)
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