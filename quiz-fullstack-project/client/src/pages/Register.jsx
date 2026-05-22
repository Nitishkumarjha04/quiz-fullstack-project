import { useState } from "react";

import axios from "axios";

function Register() {

  const [username, setUsername]
  = useState("");

  const [email, setEmail]
  = useState("");

  const [password, setPassword]
  = useState("");

  const register = async () => {

    try {

      await axios.post(

        "http://localhost:5001/api/auth/register",

        {
          username,
          email,
          password
        }
      );

      alert("Registered Successfully");

      window.location.href = "/login";

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message
      );
    }
  };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.heading}>
          📝 Register
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={styles.input}
        />

        <button
          onClick={register}
          style={styles.button}
        >
          Register
        </button>

        <p style={styles.text}>

          Already have account?

          <a href="/login">
            Login
          </a>

        </p>

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
  },

  text: {
    marginTop: "20px",
    textAlign: "center"
  }
};

export default Register;