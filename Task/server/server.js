
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const boards = [
  {
    id: 1,
    title: "Mathematics",
    teacher: "Mathematics Department",
    tasks: 5,
  },
  {
    id: 2,
    title: "Science",
    teacher: "Science Department",
    tasks: 8,
  },
  {
    id: 3,
    title: "Computer Science",
    teacher: "Computer Science Department",
    tasks: 4,
  },
];

app.get("/api/boards", (req, res) => {
  res.json(boards);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
