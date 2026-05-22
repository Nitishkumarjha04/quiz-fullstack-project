const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({

    playerName: String,

    quizId: String,

    score: Number

});

module.exports = mongoose.model(
    "Result",
    resultSchema
);