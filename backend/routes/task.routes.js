import express from "express";
import isAuth, { isAdmin } from "../middlewares/isAuth.js";
import { createTask, getTasks, updateTaskStatus } from "../controllers/task.controllers.js";
const taskRouter = express.Router();
taskRouter.post("/create", isAuth, isAdmin, createTask);
taskRouter.get("/get-all", isAuth, getTasks);
taskRouter.post("/update-status/:id", isAuth, updateTaskStatus);
export default taskRouter;