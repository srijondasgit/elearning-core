
describe ('Starting data loader' , () => {

    describe('Add classes', function() {
        require('./CBSE/class/class.js')
    })

    describe('Create subects for Class 10', function() {
        require('./CBSE/class/class10/subjects/subject.js')
    })

});