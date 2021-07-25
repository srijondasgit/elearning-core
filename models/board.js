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
    boardVersion: {
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
    class: [{
        description: { 
            type: String
        },
        subjects: [{
            subjectName: String,
            chapter: {
                chapterName: String,
                chapterDesc: String,
                questions: [],
                media:[{
                    name: String,
                    author: String,
                    aboutAuthor: String,
                    language: String,
                    url: String,
                    mediaType:{
                        type: String,
                        default: "Audio",
                        enum: ["Audio", "Video", "Youtube"]
                    }
                }]
            } 
        }]
    }]
});

module.exports = mongoose.model('Board', BoardsSchema);
