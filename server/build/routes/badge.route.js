"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const badges_controller_1 = require("../controllers/badges.controller");
const BadgeRouter = express_1.default.Router();
// POST route for adding a badge to a course
BadgeRouter.post('/add-badge-to-course', badges_controller_1.addBadgeToCourse);
BadgeRouter.get('/badge/:id', badges_controller_1.getBadgeById);
BadgeRouter.post('/redeem-rewards', badges_controller_1.redeemRewards);
exports.default = BadgeRouter;
