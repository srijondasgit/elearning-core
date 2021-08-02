//import BoardMatch from './board.js'

const mongoose = require ('mongoose');
const {ObjectId} = mongoose.Schema;
//const Board = require('./board');


const SchoolSchema = mongoose.Schema({
    indx: Number,
    schoolName: {
        type: String,
        required: true
    },
    schoolLocation: {
        type: String,
        required: true
    },
    schoolAddress: {
        type: String,
        required: true
    },
    schoolDescription: {
        type: String,
        required: true
    },
    boardassigned: {type: ObjectId, ref: 'Board'},
    customboard: {type: ObjectId, ref: 'Board'},
    governmentId: {
        type: String
    },
    status: { 
        type: String,
        default: "Created",
        enum: ["Created","Approved","Hold","Removed"]
    },
    shortCode: String
});

module.exports = mongoose.model("School", SchoolSchema);

//export const SchoolMatch = userSchema.discriminator('SchoolMatch', BoardMatch);
