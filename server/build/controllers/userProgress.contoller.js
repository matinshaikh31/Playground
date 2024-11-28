"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserProgress = exports.awardBadgeForCourseCompletion = exports.updateLectureProgress = exports.getUserProgress = void 0;
const course_model_1 = require("../models/course.model");
const badge_model_1 = __importDefault(require("../models/badge.model"));
const course_model_2 = require("../models/course.model");
const user_model_1 = __importDefault(require("../models/user.model")); // Import user model
const getUserProgress = async (req, res) => {
    const { userId, courseId } = req.params;
    try {
        const userProgress = await course_model_1.UserProgress.findOne({ userId, courseId })
            .exec();
        if (!userProgress) {
            return res.status(404).json({ message: 'Progress data not found.' });
        }
        res.status(200).json(userProgress);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getUserProgress = getUserProgress;
const updateLectureProgress = async (req, res) => {
    const { userId, courseId, lectureId } = req.body;
    const { isCompleted, progressPercentage, quizStatus } = req.body;
    try {
        // Fetch or create user progress
        let userProgress = await course_model_1.UserProgress.findOne({ userId, courseId });
        if (!userProgress) {
            userProgress = new course_model_1.UserProgress({
                userId,
                courseId,
                lectureProgress: [],
                totalCompletedLectures: 0,
                totalQuizzesPassed: 0,
                streakUpdated: false,
                earnedBadges: []
            });
        }
        // Update lecture progress
        const lectureIndex = userProgress.lectureProgress.findIndex((lp) => lp.lectureId.toString() === lectureId);
        if (lectureIndex >= 0) {
            userProgress.lectureProgress[lectureIndex] = {
                ...userProgress.lectureProgress[lectureIndex],
                isCompleted,
                progressPercentage,
                quizStatus
            };
        }
        else {
            userProgress.lectureProgress.push({
                lectureId,
                isCompleted,
                progressPercentage,
                quizStatus
            });
        }
        // Update streaks if lecture is completed
        if (isCompleted) {
            userProgress.totalCompletedLectures += 1;
            const user = await user_model_1.default.findById(userId);
            if (user) {
                user.streaks += 10;
                await user.save();
            }
        }
        if (quizStatus?.isPassed)
            userProgress.totalQuizzesPassed += 1;
        await userProgress.save();
        // Check if all course lectures are completed
        const course = await course_model_2.Course.findById(courseId).populate('lectures');
        if (course) {
            const completedLectureIds = userProgress.lectureProgress
                .filter(lp => lp.isCompleted)
                .map(lp => lp.lectureId.toString());
            const allLecturesCompleted = course.lectures.every(lecture => completedLectureIds.includes(lecture._id.toString()));
            // Award course badges to user if all lectures are completed
            if (allLecturesCompleted) {
                const user = await user_model_1.default.findById(userId);
                if (user) {
                    course.badges.forEach(badgeId => {
                        if (!user.badges.includes(badgeId)) {
                            user.badges.push(badgeId);
                        }
                    });
                    await user.save();
                }
            }
        }
        res.status(200).json({ message: 'Lecture progress updated.', userProgress });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateLectureProgress = updateLectureProgress;
const awardBadgeForCourseCompletion = async (req, res) => {
    const { userId, courseId } = req.body;
    try {
        const userProgress = await course_model_1.UserProgress.findOne({ userId, courseId });
        if (!userProgress || userProgress.totalCompletedLectures === 0) {
            return res.status(400).json({ message: 'User has not completed the course.' });
        }
        const course = await course_model_2.Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const badge = await badge_model_1.default.findOne({ courseId });
        if (badge && !userProgress.earnedBadges.includes(badge._id.toString())) {
            userProgress.earnedBadges.push(badge._id.toString());
            await userProgress.save();
            return res.status(200).json({ message: 'Badge awarded successfully', badge });
        }
        res.status(200).json({ message: 'Badge already awarded or not available.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.awardBadgeForCourseCompletion = awardBadgeForCourseCompletion;
const resetUserProgress = async (req, res) => {
    const { userId, courseId } = req.params;
    try {
        const userProgress = await course_model_1.UserProgress.findOne({ userId, courseId });
        if (!userProgress) {
            return res.status(404).json({ message: 'User progress not found' });
        }
        userProgress.lectureProgress = [];
        userProgress.totalCompletedLectures = 0;
        userProgress.totalQuizzesPassed = 0;
        userProgress.streakUpdated = false;
        userProgress.earnedBadges = [];
        await userProgress.save();
        res.status(200).json({ message: 'User progress reset successfully', userProgress });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.resetUserProgress = resetUserProgress;
