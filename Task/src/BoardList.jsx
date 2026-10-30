
import { useState, useRef, useEffect } from "react";
import BoardCard from "./BoardCard";
import "./App.css";

const INITIAL_BOARDS = [
  {
    id: 1,
    title: "Mathematics",
    grade: "Grade 8",
    teacher: "Ms. Ayesha Khan",
    color: "#4f46e5",
    tasks: [
      { id: 102, text: "Grade chapter 4 quizzes", done: true },
      { id: 103, text: "Plan geometry revision class", done: false },
    ],
  },
  {
    id: 2,
    title: "Science",
    grade: "Grade 9",
    teacher: "Mr. Bilal Ahmed",
    color: "#059669",
    tasks: [
      { id: 201, text: "Set up chemistry lab experiment", done: false },
      { id: 202, text: "Collect science fair proposals", done: false },
    ],
  },
  {
    id: 3,
    title: "Computer Science",
    grade: "Grade 10",
    teacher: "Mr. Usman Tariq",
    color: "#dc2626",
    tasks: [
      { id: 301, text: "Review HTML/CSS mini projects", done: true },
      { id: 302, text: "Prepare JavaScript basics slides", done: false },
    ],
  },
];

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const nextId = useRef(1000);

  // Fetch boards from Node.js backend
  useEffect(() => {
    async function fetchBoards() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/boards"
        );

        if (!response.ok) {
          throw new Error("Failed to load boards");
        }

        const data = await response.json();

        // Backend data ko frontend board format mein convert karein
        const formattedBoards = data.map((item) => {
          const existingBoard = INITIAL_BOARDS.find(
            (board) =>
              board.id === item.id ||
              board.title === item.name
          );

          if (existingBoard) {
            return { ...existingBoard, id: item.id };
          }

          return {
            id: item.id,
            title: item.name,
            grade: "Grade not assigned",
            teacher: "School Teacher",
            color: "#4f46e5",
            tasks: [],
          };
        });

        setBoards(formattedBoards);
        setError("");
      } catch (err) {
        console.error("Error fetching boards:", err);
        setError(
          "Boards load nahi ho sake. Backend check karein."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBoards();
  }, []);

  const updateBoardTasks = (boardId, fn) =>
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? { ...board, tasks: fn(board.tasks) }
          : board
      )
    );

  const addTask = (boardId, text) => {
    const clean = text.trim();
    if (!clean) return false;

    const id = nextId.current++;

    updateBoardTasks(boardId, (tasks) => [
      ...tasks,
      { id, text: clean, done: false },
    ]);

    return true;
  };

  const deleteTask = (boardId, taskId) =>
    updateBoardTasks(boardId, (tasks) =>
      tasks.filter((task) => task.id !== taskId)
    );

  const toggleTask = (boardId, taskId) =>
    updateBoardTasks(boardId, (tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, done: !task.done }
          : task
      )
    );

  const editTask = (boardId, taskId, text) => {
    const clean = text.trim();
    if (!clean) return false;

    updateBoardTasks(boardId, (tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, text: clean }
          : task
      )
    );

    return true;
  };

  if (loading) return <p>Loading boards...</p>;

  if (error) return <p className="error">{error}</p>;

  const totalTasks = boards.reduce(
    (total, board) => total + board.tasks.length,
    0
  );

  const doneTasks = boards.reduce(
    (total, board) =>
      total + board.tasks.filter((task) => task.done).length,
    0
  );

  if (boards.length === 0) {
    return <p className="empty">No boards yet.</p>;
  }

  return (
    <section className="board-list">
      <div className="summary">
        <div className="stat">
          <strong>{boards.length}</strong>
          <span>Boards</span>
        </div>

        <div className="stat">
          <strong>{totalTasks}</strong>
          <span>Tasks</span>
        </div>

        <div className="stat">
          <strong>{doneTasks}</strong>
          <span>Completed</span>
        </div>
      </div>

      <div className="board-grid">
        {boards.map((board) => (
          <BoardCard
            key={board.id}
            board={board}
            onAdd={addTask}
            onDelete={deleteTask}
            onToggle={toggleTask}
            onEdit={editTask}
          />
        ))}
      </div>
    </section>
  );
}

export default BoardList;
