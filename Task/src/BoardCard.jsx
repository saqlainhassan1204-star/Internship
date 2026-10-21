import { useState } from "react";
import "./App.css";

function BoardCard({ board, onAdd, onDelete, onToggle, onEdit }) {
  const { id, title, grade, teacher, color = "#4f46e5", tasks = [] } = board;

  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const done = tasks.filter((t) => t.done).length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (onAdd(id, newTask)) setNewTask("");
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (onEdit(id, editingId, editText)) setEditingId(null);
  };

  return (
    <article className="board-card" style={{ "--accent": color }}>
      <header className="card-header">
        <div>
          <h3>{title}</h3>
          <p className="board-meta">{grade} · {teacher}</p>
        </div>
        <span className="badge">{done}/{tasks.length}</span>
      </header>

      <div className="progress" aria-label={`${percent}% complete`}>
        <div className="progress-bar" style={{ width: `${percent}%` }} />
      </div>

      {tasks.length === 0 ? (
        <p className="empty">No tasks yet. Add one below.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task ${task.done ? "done" : ""}`}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggle(id, task.id)}
                aria-label={`Mark "${task.text}" as done`}
              />

              {editingId === task.id ? (
                <input
                  className="edit-input"
                  value={editText}
                  autoFocus
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <span className="task-text">{task.text}</span>
              )}

              <div className="task-actions">
                {editingId === task.id ? (
                  <>
                    <button type="button" className="btn save" onClick={saveEdit}>Save</button>
                    <button type="button" className="btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn" onClick={() => startEdit(task)}>Edit</button>
                    <button type="button" className="btn danger" onClick={() => onDelete(id, task.id)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit" className="btn primary" disabled={!newTask.trim()}>Add</button>
      </form>
    </article>
  );
}

export default BoardCard;