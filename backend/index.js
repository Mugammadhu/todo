const express = require("express");
const app = express();
const connectDatabase = require("./db.js");
const todoModel = require("./models/todoModel.js");
const cors = require("cors");
require("dotenv").config(); 

connectDatabase();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const corsOptions = {
  origin: process.env.APPLICATION_URL, // Only allow requests from your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'], // Allow Authorization and Content-Type headers
  credentials: true, // Allow cookies and other credentials
};

// Apply CORS middleware
app.use(cors(corsOptions));


app.get('/',(req,res)=>{
  res.send("<h1>Server is running with mongodb atlas database</h1><p>welcome to this server</p>")
})
//get
app.get("/tasks", async (req, res) => {
  const todos = await todoModel.find();
  res.status(200).json(todos);
});

//get by id
app.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "id is missing" });
  }
  const doc = await todoModel.findById(id);
  res.json(doc);
});

//insert
app.post("/tasks", async (req, res) => {
  const todo = req.body;
  if (!todo) {
    return res
      .status(400)
      .json({ error: "body data is missing and it is required" });
  }
  const newTodo = await todoModel.create(todo);
  res.status(200).json(newTodo);
});

//update
app.put("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "id is missing and it is required" });
  }
  const todo = req.body;
  const item = await todoModel.findByIdAndUpdate(id, todo, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    return res.status(400).json({ error: "invalid id item is missing" });
  }
  res.json(item);
});

//delete
app.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "id is missing" });
  }
  const doc = await todoModel.findById(id);
  await todoModel.findByIdAndDelete(id);
  res.json(doc);
});

const PORT= 3000
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`)
});
