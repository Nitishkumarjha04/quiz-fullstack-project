const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const http = require("http");

const { Server } =
require("socket.io");

const quizRoutes =
require("./routes/quizRoutes");

const resultRoutes =
require("./routes/resultRoutes");

const authRoutes =
require("./routes/authRoutes");

const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());

mongoose.connect(
    "mongodb://127.0.0.1:27017/quizDB"
)
.then(() =>
    console.log("MongoDB Connected")
)
.catch(err =>
    console.log(err)
);

app.use("/api/quiz", quizRoutes);

app.use("/api/result", resultRoutes);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {

    res.send("Backend Running");
});

const server =
http.createServer(app);

const io = new Server(server, {

    cors: {
        origin: "*"
    }
});

const roomPlayers = {};

const roomHosts = {};

const roomLocked = {};

io.on("connection", (socket) => {

    console.log("User Connected");

    socket.on(

        "joinRoom",

        ({ roomId, playerName }) => {

            if (roomLocked[roomId]) {

                io.to(socket.id).emit(
                    "roomLocked"
                );

                return;
            }

            socket.join(roomId);

            socket.playerName =
            playerName;

            socket.roomId =
            roomId;

            if (!roomPlayers[roomId]) {

                roomPlayers[roomId] = [];
            }

            if (!roomHosts[roomId]) {

                roomHosts[roomId] =
                socket.id;
            }

            roomPlayers[roomId].push({

                id: socket.id,

                name: playerName,

                isHost:
                roomHosts[roomId]
                === socket.id
            });

            io.to(roomId).emit(

                "playerList",

                roomPlayers[roomId]
            );

            io.to(roomId).emit(

                "playerJoined",

                {
                    message:
                    `${playerName} joined`,
                    count:
                    roomPlayers[roomId]
                    .length
                }
            );
        }
    );

    socket.on(

        "startQuiz",

        (roomId) => {

            if (
                roomHosts[roomId]
                === socket.id
            ) {

                roomLocked[roomId] =
                true;

                io.to(roomId).emit(
                    "quizStarted"
                );
            }
        }
    );

    socket.on(

        "endQuiz",

        (roomId) => {

            if (
                roomHosts[roomId]
                !== socket.id
            ) return;

            io.to(roomId).emit(
                "quizEnded"
            );

            roomLocked[roomId] =
            false;

            roomPlayers[roomId] =
            [];

            delete roomHosts[roomId];

            console.log(
                `Room ${roomId} reset`
            );
        }
    );

    socket.on(

        "kickPlayer",

        ({ roomId, playerId }) => {

            if (
                roomHosts[roomId]
                !== socket.id
            ) return;

            io.to(playerId).emit(
                "kicked"
            );

            roomPlayers[roomId] =
            roomPlayers[roomId]
            .filter(

                (player) =>
                player.id !== playerId
            );

            io.to(roomId).emit(

                "playerList",

                roomPlayers[roomId]
            );
        }
    );

    socket.on(

        "scoreSubmitted",

        (data) => {

            io.to(data.roomId).emit(

                "liveScoreUpdate",

                data
            );
        }
    );

    socket.on("disconnect", () => {

        const roomId =
        socket.roomId;

        if (
            roomId &&
            roomPlayers[roomId]
        ) {

            roomPlayers[roomId] =
            roomPlayers[roomId]
            .filter(

                (player) =>
                player.id !== socket.id
            );

            io.to(roomId).emit(

                "playerList",

                roomPlayers[roomId]
            );
        }

        console.log(
            "User Disconnected"
        );
    });
});

server.listen(5001, () => {

    console.log(
        "Server Running On Port 5001"
    );
});