const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.post('/', protect, adminOnly, createProject);
router.put('/:id', protect, adminOnly, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;
