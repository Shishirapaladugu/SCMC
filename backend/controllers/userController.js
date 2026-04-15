import { generateToken } from "../config/utils.js";
import { getCloudinary } from "../config/cloudinary.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Signup
export const signup = async (req, res) => {
    const { fullName, email, password, address } = req.body;
    try {
        if (!fullName || !email || !password || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.json({ success: false, message: "Account already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ fullName, email, password: hashedPassword, address });
        const token = generateToken(newUser._id);
        res.json({ success: true, userData: newUser, token, message: "Account created successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.json({ success: false, message: "Account not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const token = generateToken(userData._id);
        res.json({ success: true, userData, token, message: "Login successful" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Check auth
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
};

// Update profile
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, address, fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { address, fullName }, { new: true });
        } else {
            // Configure Cloudinary at call time
            const cloudinary = getCloudinary();
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: upload.secure_url, address, fullName },
                { new: true }
            );
        }
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
