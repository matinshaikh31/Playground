"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderAnalytics = exports.getCoursesAnalytics = exports.getUsersAnalytics = void 0;
const analytics_generator_1 = require("../utils/analytics.generator");
const order_Model_1 = __importDefault(require("../models/order.Model"));
const course_model_1 = require("../models/course.model");
const user_model_1 = __importDefault(require("../models/user.model"));
// Helper function for fetching analytics
const fetchAnalytics = async (model, res, entityName) => {
    try {
        const data = await (0, analytics_generator_1.generateLast12MothsData)(model);
        res.status(200).json({
            success: true,
            [entityName]: data,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to fetch ${entityName} analytics`,
            error: error.message,
        });
    }
};
// Get Users Analytics
const getUsersAnalytics = (req, res) => fetchAnalytics(user_model_1.default, res, "users");
exports.getUsersAnalytics = getUsersAnalytics;
// Get Courses Analytics
const getCoursesAnalytics = (req, res) => fetchAnalytics(course_model_1.Course, res, "courses");
exports.getCoursesAnalytics = getCoursesAnalytics;
// Get Orders Analytics
const getOrderAnalytics = (req, res) => fetchAnalytics(order_Model_1.default, res, "orders");
exports.getOrderAnalytics = getOrderAnalytics;
