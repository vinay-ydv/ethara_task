import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const isProduction = process.env.NODE_ENVIRONMENT === "production"
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, role });
        return res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
        return res.status(500).json({ message: `register error ${error}` });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).cookie("token", token, {
             httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: isProduction ? true : false,
      sameSite: isProduction ? "none" : "lax"
        }).json({
            message: `Welcome back ${user.name}`,
            user: { _id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        return res.status(500).json({ message: `login error ${error}` });
    }
}

// NEW: Fetch all members for Admin
export const getMembers = async (req, res) => {
    try {
        const members = await User.find({ role: "Member" }).select("-password");
        return res.status(200).json(members);
    } catch (error) {
        return res.status(500).json({ message: `get members error ${error}` });
    }
}