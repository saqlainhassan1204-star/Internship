import { useState, useRef } from "react";
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
  const [boards, setBoards] = useState(INITIAL_BOARDS);
  const nextId = useRef(1000); // unique ids for new tasks

  // Helper: apply a change to the tasks of one board only
  const updateBoardTasks = (boardId, fn) =>
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, tasks: fn(b.tasks) } : b))
    );

  // ADD
  const addTask = (boardId, text) => {
    const clean = text.trim();
    if (!clean) return false;
    const id = nextId.current++;
    updateBoardTasks(boardId, (tasks) => [...tasks, { id, text: clean, done: false }]);
    return true;
  };

  // DELETE
  const deleteTask = (boardId, taskId) =>
    updateBoardTasks(boardId, (tasks) => tasks.filter((t) => t.id !== taskId));

  // UPDATE (mark done / not done)
  const toggleTask = (boardId, taskId) =>
    updateBoardTasks(boardId, (tasks) =>
      tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );

  // UPDATE (edit text)
  const editTask = (boardId, taskId, text) => {
    const clean = text.trim();
    if (!clean) return false;
    updateBoardTasks(boardId, (tasks) =>
      tasks.map((t) => (t.id === taskId ? { ...t, text: clean } : t))
    );
    return true;
  };

  const totalTasks = boards.reduce((n, b) => n + b.tasks.length, 0);
  const doneTasks = boards.reduce((n, b) => n + b.tasks.filter((t) => t.done).length, 0);

  if (boards.length === 0) return <p className="empty">No boards yet.</p>;

  return (
    <section className="board-list">
      <div className="summary">
        <div className="stat"><strong>{boards.length}</strong><span>Boards</span></div>
        <div className="stat"><strong>{totalTasks}</strong><span>Tasks</span></div>
        <div className="stat"><strong>{doneTasks}</strong><span>Completed</span></div>
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