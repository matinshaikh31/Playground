"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redeemRewards = exports.getBadgeById = exports.addBadgeToCourse = void 0;
const badge_model_1 = __importDefault(require("../models/badge.model"));
const course_model_1 = require("../models/course.model");
const user_model_1 = __importDefault(require("../models/user.model")); // Import the User model
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
// Middleware function to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};
// Create a new badge and associate it with a course
const addBadgeToCourse = async (req, res) => {
    try {
        const { badgeImageUrl, title, description, name, courseId } = req.body;
        // Validate that the course exists
        const course = await course_model_1.Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Create the badge
        const badge = new badge_model_1.default({
            badgeImageUrl,
            title,
            description,
            name,
            courseName: course.name,
            courseId
        });
        await badge.save();
        // Add the badge reference to the course
        course.badges.push(badge._id);
        await course.save();
        res.status(201).json({ message: 'Badge added to course successfully', badge });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.addBadgeToCourse = addBadgeToCourse;
// Get a badge by ID
const getBadgeById = async (req, res) => {
    try {
        const { id } = req.params;
        const badge = await badge_model_1.default.findById(id);
        if (!badge) {
            return res.status(404).json({ message: 'Badge not found' });
        }
        res.status(200).json({ badge });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getBadgeById = getBadgeById;
const redeemRewards = async (req, res) => {
    try {
        const userId = req.body.userId; // Get userId from request body
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if user has enough streaks to redeem rewards
        const requiredStreaks = 20;
        if (user.streaks < requiredStreaks) {
            return res.status(400).json({ message: "Insufficient streak points to redeem rewards." });
        }
        // Deduct streak points
        user.streaks -= requiredStreaks;
        await user.save();
        // Hardcoded reward details
        const rewardDetails = {
            code: "AMZ50XDEAL",
            expiryDate: "December 31, 2025",
        };
        // Prepare email data
        const mailData = {
            reward: rewardDetails,
        };
        // Render the EJS template
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/rewards-confirmation.ejs"), mailData);
        // Send reward email
        try {
            await (0, sendMail_1.default)({
                email: user.email,
                subject: "Congratulations on Your Reward!",
                template: "rewards-confirmation.ejs",
                data: mailData,
            });
        }
        catch (error) {
            return (new ErrorHandler_1.default(error.message, 500));
        }
        res.status(200).json({ message: "Reward redeemed successfully and email sent to user." });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.redeemRewards = redeemRewards;
