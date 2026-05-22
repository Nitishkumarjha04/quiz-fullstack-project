const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({

    question: String,

    options: [String],

    correctAnswer: Number

});

const quizSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    questions: [questionSchema]

});

module.exports = mongoose.model("Quiz", quizSchema);