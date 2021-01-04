const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth')
const Task = require('../models/task');

//Create new task
router.post("/tasks", auth, async (req, res) => {
  ///Create an instance of task
  // const task = new Task(req.body);
  const task = new Task({
    //we use the spread operator to copy properties from req.body to our object created with the user property
    ...req.body,
    owner:req.user._id
  })
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.sendStatus(500).send();
  }
});
router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.sendStatus(404).send();
    }
    res.send(task);
  } catch (e) {
    res.sendStatus(500).send();
  }
  console.log(req.params);
});

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid update, property not found'
    })
  }
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();
    // const task = await Task.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    if (!task) {
      return res.status(404).send({
        error: 'No task found'
      });
    }
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) {
      return res.status(404).send({
        error: 'Task not found'
      })
    }
    res.send(task)
  } catch (e) {
    res.status(500).send(e);
  }
})


module.exports = router