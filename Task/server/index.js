

import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Temporary data
let boards = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "Science" },
  { id: 3, name: "Computer Science" },
];

// Test route
app.get("/", (req, res) => {
  res.send("Bright Future School Backend is working!");
});

// Get all boards
app.get("/api/boards", (req, res) => {
  res.json(boards);
});

// Create a new board
app.post("/api/boards", (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Board name is required",
    });
  }

  const newBoard = {
    id: Date.now(),
    name: name.trim(),
  };

  boards.push(newBoard);

  res.status(201).json({
    message: "Board created successfully",
    board: newBoard,
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
