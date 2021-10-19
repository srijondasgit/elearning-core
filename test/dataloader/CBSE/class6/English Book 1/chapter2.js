let chai = require("chai");
let chaiHttp = require("chai-http")
let server = require("../../../../../app.js")
let imp = require('./chapter1qs.js');
let ques = imp.questions

chai.should();

chai.use(chaiHttp);

//This is testing code for core functionality
describe ('Create board if board does not already exist' , () => {

    describe("post /board/getOneBoardByDescription", () => {
        it("It should get a board when searched by description", (done) => {
            chai.request('localhost:3001')
                .post("/board/getOneBoardByDescription")
                .set('Content-Type', 'application/json')
                .send({"boardName": "CBSE"})
                .end((err, response) => {
                    cbseBoardId = response.body;
                    response.should.have.status(200);
                    console.log(cbseBoardId);
                    if(cbseBoardId==="No boardId found") { console.log("CBSE Board does not exist, please check for errors and restart data generation")
                                   
                }
                else {
                    
                    describe("post /auth/register", () => {
                        it("It should create a user with SchoolAdmin role", (done) => {
                            chai.request('localhost:3001')
                                .post("/auth/register")
                                .set('Content-Type', 'application/json')
                                .send({"name":"testuser", "role": "Admin", "email": "testuser506@testuser.com", "password": "Pass123word"
                                })
                                .end((err, response) => {
                                    currentResponse = response;
                                    response.should.have.status(200);
                                    response.should.be.json;
                                    console.log("CBSE Board entry already exists, adding chapters to boardId - "+cbseBoardId)
                                done();
                                });
                        });
                    });
                                    
                    describe("post /auth/verify", () => {
                        it("It should verify a user by the passcode", (done) => {
                            chai.request('localhost:3001')
                                .post("/auth/verify")
                                .set('Content-Type', 'application/json')
                                .send({"email": "testuser506@testuser.com", "activationcode": "1000"})
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
                                .send({"email": "testuser506@testuser.com", "password": "Pass123word"})
                                .end((err, response) => {
                                    jwtToken = response.text;
                                    response.should.have.status(200);
                                    console.log(jwtToken)
                                done();
                                });
                        });
                    });

                    describe("get classId for Class 6", () => {
                        it("It should get classId for Class 6", (done) => {
                            chai.request('localhost:3001')
                                .post("/board/boardId/"+cbseBoardId+"/getClassIdByDesc")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({ "classDescription": "Class 6"})
                                .end((err, response) => {
                                    classId6 = response.body;
                                    response.should.have.status(200);
                                    console.log(classId6)
                                done();
                                });
                        });

                    });

                    describe("get subjectId English for Class 6", () => {
                        it("get subjectId English for Class 6", (done) => {
                            chai.request('localhost:3001')
                                .post("/board/boardId/"+cbseBoardId+"/classId/"+classId6+"/getSubjectIdByName")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({"subjectName" : "English"})
                                .end((err, response) => {
                                    class6eng = response.body;
                                    response.should.have.status(200);
                                    console.log("this request ran for boardid "+cbseBoardId+" and class id "+classId6)
                                    console.log(class6eng)
                                done();
                                });
                        });
                    });

                    describe("add a chapter of a subject", () => {
                        it("It should add a chapter to English for Class 6", (done) => {
                            chai.request('localhost:3001')
                                .patch("/board/boardId/"+cbseBoardId+"/classId/"+classId6+"/subjectId/"+class6eng+"/addChapter/")
                                .set('Content-Type', 'application/json')
                                .set('auth-token', jwtToken)
                                .send({"indx": 2, "chapterName": " A House, A Home","chapterDesc":"What is a house? It’s brick and stone and wood that’s hard. Some window glass Please refer your text book for the rest of the course"})
                                
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    chapterId1 = response.body;
                                    console.log(chapterId1)
                                done();
                                });
                        });
                    });
                 
                    // commented out as we are doing bulk question updates now
                    // describe("add questions to a chapter", () => {
                    //     it("It should add a question to a chapter", (done) => {
                    //         chai.request('localhost:3001')
                    //             .patch("/board/boardId/"+cbseBoardId+"/classId/"+classId6+"/subjectId/"+class6eng+"/chapterId/"+chapterId1+"/addQuestion/")
                    //             .set('Content-Type', 'application/json')
                    //             .set('auth-token', jwtToken)
                    //             .send({"indx": 1, "description": "this is a question"})
                    //             .end((err, response) => {
                    //                 response.should.have.status(200);
                    //                 questionId = response.body;
                    //                 console.log(questionId)
                    //             done();
                    //             });
                    //     });
                    // });

                    //add questions in bulk
                        describe("add bulk questions to a chapter", () => {
                            it("It should add a question to a chapter", (done) => {
                                chai.request('localhost:3001')
                                    .patch("/board/boardId/"+cbseBoardId+"/classId/"+classId6+"/subjectId/"+class6eng+"/chapterId/"+chapterId1+"/addBulkQuestions/")
                                    .set('Content-Type', 'application/json')
                                    .set('auth-token', jwtToken)
                                    //.send({"bulkQuestions":[{"indx":20, "description":"question 2"},{"indx":30, "description":"question 3"}]})
                                    .send({"bulkQuestions": ques})
                                    .end((err, response) => {
                                        response.should.have.status(200);
                                        questionId = response.body;
                                        console.log(questionId)
                                    done();
                                    });
                            });
                        });



                    describe("delete /auth/register", () => {
                        it("It should delete a user with Admin role", (done) => {
                            chai.request('localhost:3001')
                                .delete("/auth/register")
                                .set('Content-Type', 'application/json')
                                .send({"name":"testuser", "role": "Admin", "email": "testuser506@testuser.com", "password": "Pass123word"
                                })
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.should.be.json;
                                done();
                                });
                        });
                    });
                
                 
                }
            done();
            });
    });
}); 


});