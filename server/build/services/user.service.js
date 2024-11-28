"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
// get user by id
// Helper function to get user by ID
const getUserById = async (userId, res) => {
    const user = await user_model_1.default.findById(userId).select("-password"); // Exclude password
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    res.status(200).json({
        success: true,
        user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            isVerified: user.isVerified,
            courses: user.courses,
            completedCourses: user.completedCourses,
            badges: user.badges,
            streaks: user.streaks,
            title: user.title,
            about: user.about,
        },
    });
};
exports.getUserById = getUserById;
// Get All users
const getAllUsersService = async (res) => {
    const users = await user_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        users,
    });
};
exports.getAllUsersService = getAllUsersService;
// update user role
const updateUserRoleService = async (res, id, role) => {
    const user = await user_model_1.default.findByIdAndUpdate(id, { role }, { new: true });
    res.status(201).json({
        success: true,
        user,
    });
};
exports.updateUserRoleService = updateUserRoleService;
