import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://quiz-backend-ye6t.onrender.com");

function QuizRoom() {

  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);

  const [score, setScore] = useState(0);

  const [submitted, setSubmitted] = useState(false);

  const [playerName, setPlayerName] = useState("");

  const [joined, setJoined] = useState(false);

  const [quizStarted, setQuizStarted] = useState(false);

  const [players, setPlayers] = useState([]);

  const [isHost, setIsHost] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(30);

  const [liveMessage, setLiveMessage] = useState("");

  const [playerCount, setPlayerCount] = useState(1);

  const [liveScores, setLiveScores] = useState([]);

  useEffect(() => {

    fetchQuiz();

    socket.on("playerJoined", (data) => {

      setLiveMessage(data.message);

      setPlayerCount(data.count);
    });

    socket.on("playerList", (data) => {

      setPlayers(data);

      const current = data.find(
        (player) => player.name === playerName
      );

      if (current?.isHost) {

        setIsHost(true);
      }
    });

    socket.on("liveScoreUpdate", (data) => {

      setLiveScores((prev) => [
        ...prev,
        data
      ]);
    });

    socket.on("quizStarted", () => {

      setQuizStarted(true);
    });

    socket.on("quizEnded", () => {

      alert("Quiz Ended By Host");

      setQuizStarted(false);

      setSubmitted(false);

      setSelectedAnswers({});

      setTimeLeft(30);

      setLiveScores([]);

      setPlayers([]);

      setJoined(false);

      setIsHost(false);
    });

    socket.on("roomLocked", () => {

      alert("Quiz Already Started");

      window.location.href = "/";
    });

    socket.on("kicked", () => {

      alert("You were removed by host");

      window.location.href = "/";
    });

    return () => {

      socket.off("playerJoined");

      socket.off("playerList");

      socket.off("liveScoreUpdate");

      socket.off("quizStarted");

      socket.off("quizEnded");

      socket.off("roomLocked");

      socket.off("kicked");
    };

  }, [playerName]);

  useEffect(() => {

    if (submitted) return;

    if (!joined) return;

    if (!quizStarted) return;

    if (timeLeft === 0) {

      submitQuiz();

      return;
    }

    const timer = setInterval(() => {

      setTimeLeft((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [
    timeLeft,
    submitted,
    joined,
    quizStarted
  ]);

  const fetchQuiz = async () => {

    try {

      const response = await axios.get(
        "https://quiz-backend-ye6t.onrender.com/api/quiz"
      );

      const foundQuiz = response.data.find(
        (q) => q._id === id
      );

      setQuiz(foundQuiz);

    } catch (err) {

      console.log(err);
    }
  };

  const joinRoom = () => {

    if (!playerName) {

      alert("Enter Player Name");

      return;
    }

    socket.emit("joinRoom", {
      roomId: id,
      playerName
    });

    setJoined(true);
  };

  const startQuiz = () => {

    socket.emit("startQuiz", id);
  };

  const endQuiz = () => {

    socket.emit("endQuiz", id);
  };

  const kickPlayer = (playerId) => {

    socket.emit("kickPlayer", {
      roomId: id,
      playerId
    });
  };

  const selectAnswer = (
    questionIndex,
    selectedOption
  ) => {

    if (submitted) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: selectedOption
    });
  };

  const submitQuiz = async () => {

    if (submitted) {

      return;
    }

    let finalScore = 0;

    quiz.questions.forEach((q, index) => {

      if (
        selectedAnswers[index]
        === q.correctAnswer
      ) {

        finalScore++;
      }
    });

    setScore(finalScore);

    setSubmitted(true);

    try {

      await axios.post(
        "https://quiz-backend-ye6t.onrender.com/api/result/save",
        {
          playerName,
          quizId: quiz._id,
          score: finalScore
        }
      );

      socket.emit(
        "scoreSubmitted",
        {
          roomId: id,
          playerName,
          score: finalScore
        }
      );

    } catch (err) {

      console.log(err);
    }
  };

  const getOptionStyle = (
    questionIndex,
    optionIndex,
    correctAnswer
  ) => {

    const selected =
    selectedAnswers[questionIndex];

    if (!submitted) {

      if (selected === optionIndex) {

        return {
          ...styles.optionBtn,
          background: "#f59e0b"
        };
      }

      return styles.optionBtn;
    }

    if (optionIndex === correctAnswer) {

      return {
        ...styles.optionBtn,
        background: "#16a34a"
      };
    }

    if (
      selected === optionIndex &&
      selected !== correctAnswer
    ) {

      return {
        ...styles.optionBtn,
        background: "#dc2626"
      };
    }

    return styles.optionBtn;
  };

  if (!quiz) {

    return <h1>Loading...</h1>;
  }

  if (!joined) {

    return (

      <div style={styles.container}>

        <div style={styles.card}>

          <h1 style={styles.heading}>
            🎮 Join Quiz Room
          </h1>

          <input
            type="text"
            placeholder="Enter Your Name"
            value={playerName}
            onChange={(e) =>
              setPlayerName(e.target.value)
            }
            style={styles.nameInput}
          />

          <button
            style={styles.submitBtn}
            onClick={joinRoom}
          >
            Join Room
          </button>

        </div>

      </div>
    );
  }

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.heading}>
          {quiz.title}
        </h1>

        {
          isHost && (

            <div style={styles.hostControls}>

              <button
                style={styles.startBtn}
                onClick={startQuiz}
              >
                ▶ Start Quiz
              </button>

              <button
                style={styles.endBtn}
                onClick={endQuiz}
              >
                ⛔ End Quiz
              </button>

            </div>
          )
        }

        <div style={styles.liveBox}>
          ⚡ {liveMessage}
        </div>

        <div style={styles.playerBox}>
          👥 Players Online: {playerCount}
        </div>

        {
          !quizStarted && (

            <div style={styles.waitBox}>
              ⏳ Waiting For Host To Start Quiz
            </div>
          )
        }

        {
          quizStarted && (

            <>
              <div style={styles.timerBox}>
                ⏳ Time Left: {timeLeft}s
              </div>

              <div style={styles.playersSection}>

                <h2>👥 Players</h2>

                {
                  players.map((player) => (

                    <div
                      key={player.id}
                      style={styles.playerItem}
                    >

                      <span>

                        {player.name}

                        {
                          player.isHost &&
                          " 👑"
                        }

                      </span>

                      {
                        isHost &&
                        !player.isHost && (

                          <button
                            style={styles.kickBtn}
                            onClick={() =>
                              kickPlayer(player.id)
                            }
                          >
                            Remove
                          </button>
                        )
                      }

                    </div>
                  ))
                }

              </div>

              {
                quiz.questions.map((q, index) => (

                  <div
                    key={index}
                    style={styles.questionBox}
                  >

                    <h3>
                      {index + 1}. {q.question}
                    </h3>

                    {
                      q.options.map((option, i) => (

                        <button

                          key={i}

                          style={{
                            ...getOptionStyle(
                              index,
                              i + 1,
                              q.correctAnswer
                            ),

                            opacity:
                            submitted
                            ? 0.7
                            : 1
                          }}

                          onClick={() =>
                            selectAnswer(
                              index,
                              i + 1
                            )
                          }

                          disabled={submitted}
                        >

                          {option}

                        </button>
                      ))
                    }

                    {
                      submitted && (

                        <p style={styles.answerText}>

                          ✅ Correct Answer:{" "}

                          {
                            q.options[
                              q.correctAnswer - 1
                            ]
                          }

                        </p>
                      )
                    }

                  </div>
                ))
              }

              <div style={styles.liveLeaderboard}>

                <h2>
                  🏆 Live Leaderboard
                </h2>

                {
                  liveScores.map(
                    (player, index) => (

                      <div
                        key={index}
                        style={styles.livePlayer}
                      >

                        <span>
                          {player.playerName}
                        </span>

                        <span>
                          {player.score}
                        </span>

                      </div>
                    )
                  )
                }

              </div>

              <button

                style={{
                  ...styles.submitBtn,

                  opacity:
                  submitted ? 0.6 : 1,

                  cursor:
                  submitted
                  ? "not-allowed"
                  : "pointer"
                }}

                onClick={submitQuiz}

                disabled={submitted}
              >

                {
                  submitted
                  ? "Quiz Submitted"
                  : "Submit Quiz"
                }

              </button>
            </>
          )
        }

        {
          submitted && (

            <div style={styles.resultBox}>

              <h2>
                🎉 Your Score:
              </h2>

              <h1>
                {score}
                {" / "}
                {quiz.questions.length}
              </h1>

            </div>
          )
        }

      </div>

    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },

  card: {
    background: "white",
    width: "750px",
    padding: "30px",
    borderRadius: "15px"
  },

  heading: {
    color: "#2563eb",
    marginBottom: "20px"
  },

  hostControls: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },

  startBtn: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  endBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  waitBox: {
    background: "#f59e0b",
    color: "white",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "20px"
  },

  liveBox: {
    background: "#8b5cf6",
    color: "white",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "bold"
  },

  playerBox: {
    background: "#2563eb",
    color: "white",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "bold"
  },

  timerBox: {
    background: "#f59e0b",
    color: "white",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: "bold"
  },

  playersSection: {
    border: "2px solid #ddd",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px"
  },

  playerItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    background: "#f3f4f6",
    padding: "10px",
    borderRadius: "8px"
  },

  kickBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  nameInput: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  questionBox: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "20px"
  },

  optionBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  answerText: {
    marginTop: "15px",
    color: "#16a34a",
    fontWeight: "bold"
  },

  liveLeaderboard: {
    marginTop: "30px",
    padding: "20px",
    border: "2px solid #ddd",
    borderRadius: "12px"
  },

  livePlayer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    padding: "10px",
    background: "#f3f4f6",
    borderRadius: "8px"
  },

  submitBtn: {
    width: "100%",
    padding: "15px",
    marginTop: "30px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px"
  },

  resultBox: {
    marginTop: "30px",
    textAlign: "center"
  }
};

export default QuizRoom;