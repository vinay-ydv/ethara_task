import express from "express";

import isAuth, { isAdmin } from "../middlewares/isAuth.js";
import { getMembers, login, register } from "../controllers/auth.controllers.js";

const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/members", isAuth, isAdmin, getMembers); // Admin only

export default authRouter;