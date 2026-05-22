const express = require("express");

const router = express.Router();

const Result =
require("../models/Result");

router.post(

    "/save",

    async (req, res) => {

        try {

            const {
                playerName,
                quizId,
                score
            } = req.body;

            const existing =
            await Result.findOne({

                playerName,
                quizId
            });

            if (existing) {

                return res
                .status(400)
                .json({

                    message:
                    "Already Submitted"
                });
            }

            const newResult =
            new Result({

                playerName,
                quizId,
                score
            });

            await newResult.save();

            res.json({

                message:
                "Result Saved"
            });

        } catch (err) {

            res.status(500).json({
                error: err.message
            });
        }
    }
);

router.get(

    "/leaderboard",

    async (req, res) => {

        try {

            const results =
            await Result.find()
            .sort({ score: -1 });

            res.json(results);

        } catch (err) {

            res.status(500).json({
                error: err.message
            });
        }
    }
);

module.exports = router;