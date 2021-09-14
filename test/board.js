let chai = require("chai");
let chaiHttp = require("chai-http")
let server = require("../app.js")

chai.should();

chai.use(chaiHttp);

//This is testing code for core functionality
describe ('Board Api testing' , () => {

    describe("post /auth/register", () => {
        it("It should create a user with Admin role", (done) => {
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
    
    
    describe("post /auth/register", () => {
        it("It should create a user with User role", (done) => {
            chai.request('localhost:3001')
                .post("/auth/register")
                .set('Content-Type', 'application/json')
                .send({"name":"testuser", "role": "User", "email": "testuser230@testuser.com", "password": "Pass123word"
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
        it("It should verify a user with User role by the passcode", (done) => {
            chai.request('localhost:3001')
                .post("/auth/verify")
                .set('Content-Type', 'application/json')
                .send({"email": "testuser230@testuser.com", "activationcode": "1000"})
                .end((err, response) => {
                    currentResponse = response;
                    response.should.have.status(200);
                done();
                });
        });
    });


    describe("delete /auth/register", () => {
        it("It should delete a user with User role", (done) => {
            chai.request('localhost:3001')
                .delete("/auth/register")
                .set('Content-Type', 'application/json')
                .send({"name":"testuser", "role": "User", "email": "testuser230@testuser.com", "password": "Pass123word"
                })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.json;
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

    
   
    describe("modify a board /board/boardId/:boardId/modifyBoard", () => {
        it("It should modify bord details of a board", (done) => {
            chai.request('localhost:3001')
                .patch("/board/boardId/"+boardId+"/modifyBoard/")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send({"indx": 1, "boardName": "new board", "boardDescription": "updated board description", "governmentId": "some gvt id", "boardVersion": "2021.09.13"})
                .end((err, response) => {
                    boardId = response.body._id;
                    response.should.have.status(200);
                    console.log(boardId)
                done();
                });
        });
    });

    describe("get Board details using boardId", () => {
        it("It should get the Board for a boardId", (done) => {
            chai.request('localhost:3001')
                .get("/board/boardId/"+boardId+"/getBoard")
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
  
    

    describe("modify a class /board/boardId/:boardId/classId/:classId/modifyClass", () => {
        it("It should modify class details of a class", (done) => {
            chai.request('localhost:3001')
                .patch("/board/boardId/"+boardId+"/classId/"+classId+"/modifyClass/")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send({ "indx": 0, "description": "this is an updated class"})
                .end((err, response) => {
                    boardId = response.body._id;
                    response.should.have.status(200);
                    console.log(boardId)
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
                    subjectId = response.body;
                    console.log(response.body)
                done();
                });
        });
    });

    describe("modify a subject /board/boardId/:boardId/classId/:classId/subjectId/:subjectId/modifySubject", () => {
        it("It should modify subject of a class", (done) => {
            chai.request('localhost:3001')
                .patch("/board/boardId/"+boardId+"/classId/"+classId+"/subjectId/"+subjectId+"/modifySubject/")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send({ "indx": 0, "description": "this is new update of subject"})
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                });
        });
    });

    
    
    describe("add a chapter of a subject /boardId/:boardId/classId/:classId/subjectId/:subjectId/addChapter", () => {
        it("It should add a chapter of a subject", (done) => {
            chai.request('localhost:3001')
                .patch("/board/boardId/"+boardId+"/classId/"+classId+"/subjectId/"+subjectId+"/addChapter/")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send({"indx": 1, "chapterName": "first chapter"})
                .end((err, response) => {
                    response.should.have.status(200);
                    chapterId = response.body;
                    console.log(response.body)
                done();
                });
        });
    });
    
    describe("modify a chapter /board/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/modifyChapter", () => {
        it("It should modify chapter of a subject", (done) => {
            chai.request('localhost:3001')
                .patch("/board/boardId/"+boardId+"/classId/"+classId+"/subjectId/"+subjectId+"/chapterId/"+chapterId+"/modifyChapter/")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send({ "indx": 0, "description": "this is new update of chapter"})
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                });
        });
    });

   
    
    
    describe("add a media to a chapter /boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/addMedia", () => {
        it("It should add a media to a chapter", (done) => {
            chai.request('localhost:3001')
                .patch("/board/boardId/"+boardId+"/classId/"+classId+"/subjectId/"+subjectId+"/chapterId/"+chapterId+"/addMedia/")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send({"indx": 1, "chapterName": "first chapter"})
                .end((err, response) => {
                    response.should.have.status(200);
                    mediaId = response.body;
                    console.log(response.body)
                done();
                });
        });
    });


    describe("modify a media /board/boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/mediaId/:mediaId/modifyMedia", () => {
        it("It should modify media of a chapter", (done) => {
            chai.request('localhost:3001')
                .patch("/board/boardId/"+boardId+"/classId/"+classId+"/subjectId/"+subjectId+"/chapterId/"+chapterId+"/mediaId/"+mediaId+"/modifyMedia/")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send({ "indx": 0, "description": "this is new update of media"})
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                });
        });
    });

    describe("add a Question to a chapter /boardId/:boardId/classId/:classId/subjectId/:subjectId/chapterId/:chapterId/addQuestion", () => {
        it("It should add a Question to a chapter", (done) => {
            chai.request('localhost:3001')
                .patch("/board/boardId/"+boardId+"/classId/"+classId+"/subjectId/"+subjectId+"/chapterId/"+chapterId+"/addQuestion/")
                .set('Content-Type', 'application/json')
                .set('auth-token', jwtToken)
                .send({"indx": 1, "chapterName": "first chapter"})
                .end((err, response) => {
                    response.should.have.status(200);
                    QuestionId = response.body;
                    console.log(response.body)
                done();
                });
        });
    });

    describe("get class details using boardId", () => {
        it("It should get the Board for a boardId", (done) => {
            chai.request('localhost:3001')
                .get("/board/boardId/"+boardId+"/getBoard")
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

    
    describe("delete /media", () => {
        it("It should delete a media from a chapter", (done) => {
            chai.request('localhost:3001')
                .delete("/board/boardid/"+boardId+"/classId/"+classId+"/subjectId/"+subjectId+"/chapterId/"+chapterId+"/mediaId/"+mediaId)
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



    describe("delete /Question", () => {
        it("It should delete a Question from a chapter", (done) => {
            chai.request('localhost:3001')
                .delete("/board/boardid/"+boardId+"/classId/"+classId+"/subjectId/"+subjectId+"/chapterId/"+chapterId+"/QuestionId/"+QuestionId)
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


    describe("delete /chapter", () => {
        it("It should delete a chapter from a subject", (done) => {
            chai.request('localhost:3001')
                .delete("/board/boardid/"+boardId+"/classId/"+classId+"/subjectId/"+subjectId+"/chapterId/"+chapterId)
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

    
    describe("delete /subject", () => {
        it("It should delete a subject from a class", (done) => {
            chai.request('localhost:3001')
                .delete("/board/boardid/"+boardId+"/classId/"+classId+"/subjectId/"+subjectId)
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

    describe("delete /class", () => {
        it("It should delete a class from a board", (done) => {
            chai.request('localhost:3001')
                .delete("/board/boardid/"+boardId+"/classId/"+classId)
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