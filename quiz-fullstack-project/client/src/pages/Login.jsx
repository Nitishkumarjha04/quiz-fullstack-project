import { useState } from "react";

import axios from "axios";

function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword]
  = useState("");

  const login = async () => {

    try {

      const response = await axios.post(

        "https://quiz-backend-ye6t.onrender.com/api/auth/login",

        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login Successful");

      window.location.href = "/";

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
          🔐 Login
        </h1>

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
          onClick={login}
          style={styles.button}
        >
          Login
        </button>

        <p style={styles.text}>

          Don't have account?

          <a href="/register">
            Register
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

export default Login;