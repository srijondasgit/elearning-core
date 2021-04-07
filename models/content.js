const mongoose = require ('mongoose');

const contentSchema = mongoose.Schema({
    contentName: {
        type: String,
        required: true
    },
    contentCreator: {
        type: Array,
        required: true
    },
    contentDescription: {
        type: String
    },
    contentType: { 
        type: String,
        default: "Text",
        enum: ["Text","Audio","Video","Image"]
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

module.exports = mongoose.model('Content', contentSchema);
