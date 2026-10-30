import { useEffect, useState } from "react";
import BoardList from "./BoardList";
import "./App.css";

// On a free host, set VITE_API_URL to your deployed backend link
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Turns any error into a clear message for the teacher
function getErrorMessage(err) {
  if (err instanceof TypeError) {
    return "Cannot connect to the server. Please check that it is running.";
  }
  return err.message || "Something went wrong. Please try again.";
}

function App() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boardName, setBoardName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load existing boards when the page opens
  useEffect(() => {
    async function loadBoards() {
      try {
        const res = await fetch(`${API_URL}/api/boards`);
        if (!res.ok) throw new Error("Could not load boards.");
        setBoards(await res.json());
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadBoards();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const name = boardName.trim();
    if (!name) {
      setError("Please enter a board name.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to create board.");
      }

      // Show the new board straight away, no page refresh needed
      setBoards((prev) => [...prev, data.board]);
setSuccess(`"${data.board.name}" board created successfully!`);
      setBoardName("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏫 Bright Future School</h1>
        <p>
          Teacher Task Board — organise class projects and tasks in one place
        </p>
      </header>

      <main className="app-main">
        {/* Add Board Form */}
        <section className="add-board">
          <h2>Manage Your Boards</h2>
          <h3>Create a new class board</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter board name"
              aria-label="Board name"
              maxLength={50}
              value={boardName}
              disabled={saving}
              onChange={(e) => setBoardName(e.target.value)}
            />

            <button type="submit" disabled={saving}>
              {saving ? "Adding..." : "Add Board"}
            </button>
          </form>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="success" role="status">
              {success}
            </p>
          )}
        </section>

        {/* Display existing boards */}
        {loading ? (
          <p className="loading">Loading boards...</p>
        ) : (
          <BoardList boards={boards} />
        )}
      </main>

      <footer className="app-footer">
        © Bright Future School · Internal staff use
      </footer>
    </div>
  );
}

export default App;