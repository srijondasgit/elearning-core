const mongoose = require ('mongoose');

const ChaptersSchema = mongoose.Schema({
    chapterIndex: {
        type: Number,
        required: true
    },
    boardName: {
        type: String,
        required: true
    },
    boardDescription: {
        type: String,
        required: true
    },
    governmentId: {
        type: String
    },
    status: { 
        type: String,
        default: "Created",
        enum: ["Created","Approved","Hold","Removed"]
    },
    standardContent: {
        type: Array
    },
    customContent: {
        type: Array
    },
    standardQuestionSet: {
        type: Array
    },
    customQuestionSet: {
        type: Array
    }
});

module.exports = mongoose.model('Chapter', ChaptersSchema);
