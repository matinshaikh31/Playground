"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analytic_controller_1 = require("../controllers/analytic.controller");
const Arouter = express_1.default.Router();
// Admin-only routes (ensure to add authentication middleware if needed)
Arouter.get("/usersAnalytics", analytic_controller_1.getUsersAnalytics);
Arouter.get("/coursesAnalytics", analytic_controller_1.getCoursesAnalytics);
Arouter.get("/ordersAnalytics", analytic_controller_1.getOrderAnalytics);
exports.default = Arouter;
