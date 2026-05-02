import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "User not authenticated" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Invalid token" })
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "Admin") {
        next();
    } else {
        return res.status(403).json({ message: "Admin access required" })
    }
};

export default isAuth;