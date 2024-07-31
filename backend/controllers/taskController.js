// backend/controllers/taskController.js
const Task = require('../models/taskModel');

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  const { task, description, completed } = req.body;

  if (!task || !description) {
    return res.status(400).json({ message: 'Title and Description are required' });
  }

  try {
    const newTask = new Task({ task, description, completed });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { task, description, completed } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { task, description, completed }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting task', error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
