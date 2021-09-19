let chai = require("chai");
let chaiHttp = require("chai-http")
let server = require("../../../../app.js")
const classvar = require('../classsubject.js/index.js');

chai.should();

chai.use(chaiHttp);



//This is testing code for core functionality
describe ('Create all subjects' , () => {

        before(async () => {  
            //require('../class.js');
        })
        
        describe("post /auth/register", () => {
            it("It should create a user with SchoolAdmin role", (done) => {
                chai.request('localhost:3001')
                    .post("/auth/register")
                    .set('Content-Type', 'application/json')
                    .send({"name":"testuser", "role": "Admin", "email": "testuser503@testuser.com", "password": "Pass123word"
                    })
                    .end((err, response) => {
                        currentResponse = response;
                        response.should.have.status(200);
                        response.should.be.json;
                        console.log("Current board id is : "+ classvar.dpBoardId);
                        console.log("Subject id is : "+ classvar.dpC10SubSs);
                    done();
                    });
            });
        });
    
    
        describe("post /auth/verify", () => {
            it("It should verify a user by the passcode", (done) => {
                chai.request('localhost:3001')
                    .post("/auth/verify")
                    .set('Content-Type', 'application/json')
                    .send({"email": "testuser503@testuser.com", "activationcode": "1000"})
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
                    .send({"email": "testuser503@testuser.com", "password": "Pass123word"})
                    .end((err, response) => {
                        jwtToken = response.text;
                        response.should.have.status(200);
                        console.log(jwtToken)
                    done();
                    });
            });
        });


        //add subject
        describe("add subject using board and classid /boardId/:boardId/classId/:classId/addSubject", () => {
            it("It should add a subject to a class", (done) => {
                chai.request('localhost:3001')
                    .patch("/board/boardId/"+classvar.dpBoardId+"/classId/"+classvar.classId10+"/addSubject")
                    .set('Content-Type', 'application/json')
                    .set('auth-token', jwtToken)
                    .send({"indx": 1, "subjectName": "Social Science"})
                    .end((err, response) => {
                        response.should.have.status(200);
                        dpC10SubSs = response;
                        console.log("Class 10 - Social science subject id : ");
                        //console.log(dpC10SubSs)
                    done();
                    });
            });
        });

        describe("delete /auth/register", () => {
            it("It should delete a user with Admin role", (done) => {
                chai.request('localhost:3001')
                    .delete("/auth/register")
                    .set('Content-Type', 'application/json')
                    .send({"name":"testuser", "role": "Admin", "email": "testuser503@testuser.com", "password": "Pass123word"
                    })
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.should.be.json;
                    done();
                    });
            });
        });



});