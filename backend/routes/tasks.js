const express = require('express');
const router = express.Router();
const { getTasks, getTaskById, createTask, updateTask, deleteTask, getTaskStats } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, getTaskStats);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTaskById);
router.post('/', protect, adminOnly, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, adminOnly, deleteTask);

module.exports = router;
