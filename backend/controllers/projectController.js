const Project = require('../models/Project');
const Task = require('../models/Task');

// @GET /api/projects
const getProjects = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query = { members: req.user._id };
    }
    const projects = await Project.find(query)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (req.user.role !== 'admin') {
      const isMember = project.members.some(m => m._id.toString() === req.user._id.toString());
      if (!isMember) return res.status(403).json({ message: 'Access denied' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/projects
const createProject = async (req, res) => {
  try {
    const { title, description, members, dueDate, color, status } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const project = await Project.create({
      title, description, members: members || [],
      dueDate, color, status,
      createdBy: req.user._id,
    });
    const populated = await project.populate('members', 'name email role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, description, members, dueDate, color, status } = req.body;
    project.title = title || project.title;
    project.description = description !== undefined ? description : project.description;
    project.members = members || project.members;
    project.dueDate = dueDate || project.dueDate;
    project.color = color || project.color;
    project.status = status || project.status;

    const updated = await project.save();
    const populated = await updated.populate('members', 'name email role');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await Task.deleteMany({ projectId: req.params.id });
    await project.deleteOne();
    res.json({ message: 'Project and associated tasks deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };
