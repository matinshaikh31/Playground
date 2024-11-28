"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userProgress_contoller_1 = require("../controllers/userProgress.contoller");
const progressRouter = express_1.default.Router();
progressRouter.get('/getprogress/:userId/:courseId', userProgress_contoller_1.getUserProgress);
progressRouter.post('/update-progress', userProgress_contoller_1.updateLectureProgress);
progressRouter.post('/award-badge', userProgress_contoller_1.awardBadgeForCourseCompletion);
progressRouter.post('/reset/:userId/:courseId', userProgress_contoller_1.resetUserProgress);
exports.default = progressRouter;
