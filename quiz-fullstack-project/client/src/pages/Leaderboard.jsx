import { useEffect, useState } from "react";

import axios from "axios";

function Leaderboard() {

  const [results, setResults]
  = useState([]);

  useEffect(() => {

    fetchLeaderboard();

    const interval = setInterval(() => {

      fetchLeaderboard();

    }, 2000);

    return () =>
      clearInterval(interval);

  }, []);

  const fetchLeaderboard =
  async () => {

    try {

      const response =
      await axios.get(

        "https://quiz-backend-ye6t.onrender.com/api/result/leaderboard"
      );

      setResults(response.data);

    } catch (err) {

      console.log(err);
    }
  };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.heading}>
          🏆 Leaderboard
        </h1>

        {
          results.length === 0 && (

            <h3>
              No Results Yet
            </h3>
          )
        }

        {
          results.map(
            (result, index) => (

              <div
                key={result._id}
                style={styles.playerBox}
              >

                <div>

                  <h3>

                    #{index + 1}
                    {" "}
                    {result.playerName}

                  </h3>

                </div>

                <div>

                  <h2>
                    {result.score}
                  </h2>

                </div>

              </div>
            )
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
    width: "600px",
    padding: "30px",
    borderRadius: "15px"
  },

  heading: {
    textAlign: "center",
    color: "#2563eb",
    marginBottom: "30px"
  },

  playerBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f3f4f6",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "15px"
  }
};

export default Leaderboard;