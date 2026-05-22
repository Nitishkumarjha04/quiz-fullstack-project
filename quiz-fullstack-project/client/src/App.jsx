import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";

import QuizRoom from "./pages/QuizRoom";

import Leaderboard from "./pages/Leaderboard";

import Login from "./pages/Login";

import Register from "./pages/Register";

import JoinRoom from "./pages/JoinRoom";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/quiz/:id"
          element={<QuizRoom />}
        />

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/join"
          element={<JoinRoom />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

