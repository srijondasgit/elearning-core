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
                })
        })
    })

    

});