"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Badge Interface and Schema
const mongoose_1 = __importDefault(require("mongoose"));
const BadgeSchema = new mongoose_1.default.Schema({
    badgeImageUrl: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    courseName: { type: String, required: true },
    courseId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// Define model with explicit Model<IBadge> type to avoid casting issues
const Badge = mongoose_1.default.model('Badge', BadgeSchema);
exports.default = Badge;
