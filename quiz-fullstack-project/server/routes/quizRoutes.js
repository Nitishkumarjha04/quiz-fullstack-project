const express = require("express");

const router = express.Router();

const Quiz = require("../models/Quiz");

router.post("/create", async (req, res) => {

    try {

        const quiz = new Quiz(req.body);

        await quiz.save();

        res.status(201).json({
            success: true,
            message: "Quiz Created Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.get("/", async (req, res) => {

    try {

        const quizzes = await Quiz.find();

        res.json(quizzes);

    } catch (err) {

        res.status(500).json(err);
    }
});

router.put("/:id", async (req, res) => {

    try {

        const updatedQuiz =
        await Quiz.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }
        );

        res.json({
            success: true,
            updatedQuiz
        });

    } catch (err) {

        res.status(500).json(err);
    }
});

router.delete("/:id", async (req, res) => {

    try {

        await Quiz.findByIdAndDelete(
            req.params.id
        );

        res.json({
            success: true,
            message: "Quiz Deleted"
        });

    } catch (err) {

        res.status(500).json(err);
    }
});

module.exports = router;