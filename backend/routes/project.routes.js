import express from "express";
import isAuth, { isAdmin } from "../middlewares/isAuth.js";
import { createProject, getAllProjects } from "../controllers/project.controllers.js";
const projectRouter = express.Router();
projectRouter.post("/create", isAuth, isAdmin, createProject);
projectRouter.get("/get-all", isAuth, getAllProjects);
export default projectRouter;