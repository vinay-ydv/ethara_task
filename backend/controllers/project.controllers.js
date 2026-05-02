import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const project = await Project.create({
            name, description, owner: req.user._id, members: members || []
        });
        return res.status(201).json(project);
    } catch (error) {
        return res.status(500).json({ message: `create project error ${error}` });
    }
}

export const getAllProjects = async (req, res) => {
    try {
        // Admin sees all, Member sees projects they are a part of
        const filter = req.user.role === "Admin" ? {} : { members: req.user._id };
        const projects = await Project.find(filter).populate("members", "name email");
        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({ message: `get all projects error ${error}` });
    }
}