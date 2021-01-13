const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth')
const Task = require('../models/task');

//Create new task for the logged in user
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
//Get all tasks for logged in user
router.get("/tasks", auth,async (req, res) => {
  try {
    // const tasks = await Task.find({
    // owner:req.user._id});
    //res.send(tasks);
    //alternate to the above using populate method
    await req.user.populate('tasks').execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.sendStatus(500).send();
  }
});

//fetch a task by id for logged in user
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    //the below is used when user is not authenticated by auth
    // const task = await Task.findById(_id);
    ///we use this when auth is used
    const task = await Task.findOne({
      _id,
      owner:req.user._id
    })
    if (!task) {
      return res.sendStatus(404).send();
    }
    res.send(task);
  } catch (e) {
    res.sendStatus(500).send();
  }
  console.log(req.params);
});

///Update a task by id for the logged in user
router.patch('/tasks/:id', auth, async (req, res) => {
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
    // const task = await Task.findById(_id);
    //the below is used when the user is authenticated
    const task = await Task.findOne({_id, owner: req.user._id})

    // const task = await Task.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    if (!task) {
      return res.status(404).send({
        error: 'No task found'
      });
    }
    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

///Delete task by id for logged in user
router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOneAndDelete({_id,owner:req.user._id});
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