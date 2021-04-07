const mongoose = require ('mongoose');

const QuestionSetSchema = mongoose.Schema({
    questionIndex: {
        type: Number,
        required: true
    },
    questionDescription: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('QuestionSet', QuestionSetSchema);
