const mongoose = require ('mongoose');

const SchoolsSchema = mongoose.Schema({
    charityName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    charityGvtId: {
        type: String
    },
    ownerName: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        required: true
    },
    status: { 
        type: String,
        default: "Created",
        enum: ["Created","Approved","Hold","Removed"]
    },
    createdRafflesIds: {
        type: Array
    }
});

module.exports = mongoose.model('School', SchoolsSchema);
