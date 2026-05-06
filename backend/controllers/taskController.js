const Task = require('../models/Task');
const Project = require('../models/Project');

// @GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = {};

    if (projectId) {
      query.projectId = projectId;
    }

    if (req.user.role !== 'admin') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title color')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title color')
      .populate('createdBy', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, projectId } = req.body;
    if (!title || !projectId) return res.status(400).json({ message: 'Title and projectId are required' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title, description, status, priority, dueDate, assignedTo, projectId,
      createdBy: req.user._id,
    });
    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'projectId', select: 'title color' },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    // Members can only update status
    if (req.user.role !== 'admin') {
      if (status) task.status = status;
    } else {
      task.title = title || task.title;
      task.description = description !== undefined ? description : task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
      task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
    }

    const updated = await task.save();
    const populated = await updated.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'projectId', select: 'title color' },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/tasks/stats
const getTaskStats = async (req, res) => {
  try {
    let matchQuery = {};
    if (req.user.role !== 'admin') {
      matchQuery.assignedTo = req.user._id;
    }

    const now = new Date();
    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      Task.countDocuments(matchQuery),
      Task.countDocuments({ ...matchQuery, status: 'pending' }),
      Task.countDocuments({ ...matchQuery, status: 'in-progress' }),
      Task.countDocuments({ ...matchQuery, status: 'completed' }),
      Task.countDocuments({ ...matchQuery, status: { $ne: 'completed' }, dueDate: { $lt: now } }),
    ]);

    const totalProjects = req.user.role === 'admin'
      ? await (require('../models/Project')).countDocuments()
      : await (require('../models/Project')).countDocuments({ members: req.user._id });

    res.json({ totalProjects, total, pending, inProgress, completed, overdue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, getTaskStats };
