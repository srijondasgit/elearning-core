
describe ('Starting data loader' , () => {

    describe('Add classes', function() {
        
        require('./CBSE/classsubject.js')
    })


    describe('Add subjects', function() {
        

        //class 10 social science

        require('./CBSE/class10/sub1socsc/chapter1.js')
        require('./CBSE/class10/sub1socsc/chapter2.js')
        require('./CBSE/class10/sub1socsc/chapter3.js')



        //class 10 science

        require('./CBSE/class10/sub2science/chapter1.js')



        // class 10 english

        require('./CBSE/class10/sub3english/chapter1.js')
    

        // class 09 social science

        require('./CBSE/class09/sub1socsc/chapter1.js')

    })

    



});