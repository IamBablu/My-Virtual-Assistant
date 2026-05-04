import User from "../models/user.model.js";
import  getToken  from "../config/token.js";
import bcrypt from "bcryptjs";
export const Singnup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }   
        const hashedPassword = await bcrypt.hash(password, 8);
        // Create new user
        const user = await User.create(
            { name, email, password: hashedPassword }
            );

            const token = await getToken(user._id);
            res.cookie("token", token,{
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 90 * 24 * 60 * 60 * 1000
            })
            res.status(201).json({ message: "User created successfully", user});
    }
    catch (error) {
        res.status(500).json({ message: "Error signing up", error });
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }   
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not exist" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = await getToken(user._id);
        res.cookie("token", token,{
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 90 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({ message: "Login successful", user });    
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }   
}

export const Logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error });
    }
}   