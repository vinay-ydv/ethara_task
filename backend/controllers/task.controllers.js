import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
    try {
        const { title, description, project, assignedTo } = req.body;
        if (!title || !project || !assignedTo) {
            return res.status(400).json({ message: "Title, project, and assignee are required" });
        }
        const task = await Task.create({ title, description, project, assignedTo });
        return res.status(201).json(task);
    } catch (error) {
        return res.status(500).json({ message: `create task error ${error}` });
    }
}

export const getTasks = async (req, res) => {
    try {
        // Admin sees all, Member sees only their assigned tasks
        const filter = req.user.role === "Admin" ? {} : { assignedTo: req.user._id };
        const tasks = await Task.find(filter).populate("project", "name").populate("assignedTo", "name email");
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({ message: `get tasks error ${error}` });
    }
}

export const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Security check: Only Admin or the assigned Member can update this task
        if (req.user.role !== "Admin" && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this task" });
        }

        task.status = status;
        await task.save();
        return res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ message: `update task error ${error}` });
    }
}