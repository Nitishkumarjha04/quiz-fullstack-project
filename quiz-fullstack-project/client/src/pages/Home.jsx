import { useEffect, useState } from "react";

import axios from "axios";

function Home() {

  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");

  const [questions, setQuestions] = useState([

    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 1
    }
  ]);

  const [quizzes, setQuizzes] = useState([]);

  const [editingQuizId, setEditingQuizId]
  = useState(null);

  useEffect(() => {

    fetchQuizzes();

  }, []);

  const fetchQuizzes = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5001/api/quiz"
      );

      setQuizzes(response.data);

    } catch (err) {

      console.log(err);
    }
  };

  const handleQuestionChange = (
    index,
    field,
    value
  ) => {

    const updatedQuestions = [...questions];

    updatedQuestions[index][field] = value;

    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    questionIndex,
    optionIndex,
    value
  ) => {

    const updatedQuestions = [...questions];

    updatedQuestions[
      questionIndex
    ].options[optionIndex] = value;

    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {

    setQuestions([

      ...questions,

      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 1
      }
    ]);
  };

  const editQuiz = (quiz) => {

    setEditingQuizId(quiz._id);

    setTitle(quiz.title);

    setQuestions(quiz.questions);
  };

  const createQuiz = async () => {

    try {

      if (editingQuizId) {

        await axios.put(

          `http://localhost:5001/api/quiz/${editingQuizId}`,

          {
            title,
            questions
          }
        );

        alert("Quiz Updated Successfully");

      } else {

        await axios.post(
          "http://localhost:5001/api/quiz/create",
          {
            title,
            questions
          }
        );

        alert("Quiz Created Successfully");
      }

      setEditingQuizId(null);

      setTitle("");

      setQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 1
        }
      ]);

      fetchQuizzes();

    } catch (err) {

      console.log(err);

      alert("Error");
    }
  };

  const deleteQuiz = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5001/api/quiz/${id}`
      );

      alert("Quiz Deleted");

      fetchQuizzes();

    } catch (err) {

      console.log(err);

      alert("Error Deleting Quiz");
    }
  };

  return (

    <div style={styles.container}>

      <div style={styles.left}>

        {
          token ? (

            <div style={styles.card}>

              <h1 style={styles.heading}>
                🏆 Quiz Competition
              </h1>

              <div style={styles.authButtons}>

                <a href="/login">

                  <button style={styles.loginBtn}>
                    Login
                  </button>

                </a>

                <a href="/register">

                  <button style={styles.registerBtn}>
                    Register
                  </button>

                </a>

              </div>

              <input
                type="text"
                placeholder="Quiz Title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                style={styles.input}
              />

              {
                questions.map((q, index) => (

                  <div
                    key={index}
                    style={styles.questionBox}
                  >

                    <h3>
                      Question {index + 1}
                    </h3>

                    <input
                      type="text"
                      placeholder="Question"
                      value={q.question}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "question",
                          e.target.value
                        )
                      }
                      style={styles.input}
                    />

                    {
                      q.options.map((option, i) => (

                        <input
                          key={i}
                          type="text"
                          placeholder={`Option ${i + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              i,
                              e.target.value
                            )
                          }
                          style={styles.input}
                        />
                      ))
                    }

                    <input
                      type="number"
                      min="1"
                      max="4"
                      placeholder="Correct Answer (1-4)"
                      value={q.correctAnswer}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "correctAnswer",
                          Number(e.target.value)
                        )
                      }
                      style={styles.input}
                    />

                  </div>
                ))
              }

              <button
                onClick={addQuestion}
                style={styles.addBtn}
              >
                ➕ Add Question
              </button>

              <button
                onClick={createQuiz}
                style={styles.button}
              >
                {
                  editingQuizId
                  ? "Update Quiz"
                  : "Create Quiz"
                }
              </button>

            </div>

          ) : (

            <div style={styles.card}>

              <h1 style={styles.heading}>
                🔒 Login Required
              </h1>

              <p>
                Please login to create,
                edit or delete quizzes.
              </p>

              <a href="/login">

                <button style={styles.button}>
                  Go To Login
                </button>

              </a>

            </div>
          )
        }

      </div>

      <div style={styles.right}>

        <h2 style={{ color: "white" }}>
          📚 All Quizzes
        </h2>

        <a
          href="/leaderboard"
          style={{
            textDecoration: "none"
          }}
        >

          <button style={styles.leaderboardBtn}>
            View Leaderboard
          </button>

        </a>

        <a
          href="/join"
          style={{
            textDecoration: "none"
          }}
        >

          <button style={styles.joinBtn}>
            Join Quiz Room
          </button>

        </a>

        {
          token && (

            <button
              style={styles.logoutBtn}
              onClick={() => {

                localStorage.removeItem("token");

                localStorage.removeItem("user");

                alert("Logged Out");

                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          )
        }

        {
          quizzes.map((quiz) => (

            <div
              key={quiz._id}
              style={styles.quizCard}
            >

              <h3>{quiz.title}</h3>

              <p>
                Questions:
                {" "}
                {quiz.questions.length}
              </p>

              <a
                href={`/quiz/${quiz._id}`}
                style={{
                  textDecoration: "none"
                }}
              >

                <button style={styles.startBtn}>
                  Start Quiz
                </button>

              </a>

              {
                token && (

                  <>
                    <button
                      style={styles.editBtn}
                      onClick={() =>
                        editQuiz(quiz)
                      }
                    >
                      Edit Quiz
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() =>
                        deleteQuiz(quiz._id)
                      }
                    >
                      Delete Quiz
                    </button>
                  </>
                )
              }

            </div>
          ))
        }

      </div>

    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    background: "#0f172a",
    padding: "20px",
    gap: "20px"
  },

  left: {
    flex: 1
  },

  right: {
    flex: 1
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "15px"
  },

  heading: {
    marginBottom: "20px",
    color: "#2563eb"
  },

  authButtons: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },

  loginBtn: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  registerBtn: {
    padding: "10px 20px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  questionBox: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "20px"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  addBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    background: "#9333ea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  quizCard: {
    background: "white",
    padding: "20px",
    marginTop: "15px",
    borderRadius: "12px"
  },

  startBtn: {
    padding: "10px 20px",
    marginTop: "10px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  editBtn: {
    padding: "10px 20px",
    marginTop: "10px",
    marginLeft: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  deleteBtn: {
    padding: "10px 20px",
    marginTop: "10px",
    marginLeft: "10px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  leaderboardBtn: {
    padding: "12px 20px",
    background: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px"
  },

  joinBtn: {
    padding: "12px 20px",
    background: "#8b5cf6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px",
    marginLeft: "10px"
  },

  logoutBtn: {
    padding: "12px 20px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px",
    marginLeft: "10px"
  }
};

export default Home;