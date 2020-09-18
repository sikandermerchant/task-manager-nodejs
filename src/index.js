//Setup express server
const express = require("express");

//Load (require) mongoose.js
require('./db/mongoose');

//Load user
const User = require('./models/user');

//Load task
const Task = require('./models/task')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res) => {
  //create an instance of a new user
  const user = new User(req.body);
  user.save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((error) => {
      res.status(400).send(error);
    })
})

app.post('/tasks', (req, res) => {
  ///Create an instance of task
  const task = new Task(req.body)
  task.save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((error) => {
      res.status(400).send(error);
    })
})

//Start the server
app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});