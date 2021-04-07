const mongoose = require ('mongoose');

const BoardsSchema = mongoose.Schema({
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
    }
});

module.exports = mongoose.model('Board', BoardsSchema);
