const mongoose = require ('mongoose');

const BoardsSchema = mongoose.Schema({
    indx: Number,
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
            indx: Number, 
            type: String
        },
        subjects: [{
            indx: Number,
            subjectName: {
                type: String
            },
            chapter: [{
                indx: Number,
                chapterName: String,
                chapterDesc: String,
                questions: [{
                    indx: Number,
                    description: String}],
                media:[{
                    indx: Number,
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
            }] 
        }]
    }]
});

module.exports = mongoose.model('Board', BoardsSchema);
