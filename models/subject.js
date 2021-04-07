const mongoose = require ('mongoose');

const subjectSchema = mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    },
    boardId: {
        type: String,
        required: true
    },
    subjectDescription: {
        type: String
    },
    status: { 
        type: String,
        default: "Created",
        enum: ["Created","Approved","Hold","Removed"]
    },
    chapters: {
        type: Array
    }
});

module.exports = mongoose.model('Subject', subjectSchema);
