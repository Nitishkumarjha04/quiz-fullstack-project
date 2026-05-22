import { useState } from "react";

function JoinRoom() {

  const [roomId, setRoomId]
  = useState("");

  const joinRoom = () => {

    if (!roomId) {

      alert("Enter Room ID");

      return;
    }

    window.location.href =
    `/quiz/${roomId}`;
  };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.heading}>
          🎮 Join Quiz Room
        </h1>

        <input
          type="text"
          placeholder="Enter Quiz ID"
          value={roomId}
          onChange={(e) =>
            setRoomId(e.target.value)
          }
          style={styles.input}
        />

        <button
          onClick={joinRoom}
          style={styles.button}
        >
          Join Quiz
        </button>

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
    alignItems: "center"
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "400px"
  },

  heading: {
    textAlign: "center",
    color: "#2563eb",
    marginBottom: "20px"
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
  }
};

export default JoinRoom;