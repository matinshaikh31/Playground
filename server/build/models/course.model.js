"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProgress = exports.Course = exports.Lecture = exports.Quiz = exports.Review = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ReviewSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number },
    comment: { type: String, required: true },
    commentReplies: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Review' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const QuestionSchema = new mongoose_1.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }
});
const QuizSchema = new mongoose_1.Schema({
    questions: [QuestionSchema],
    totalQuestions: { type: Number, required: true },
    passingScore: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const LectureSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnailPicUrl: { type: String, required: true },
    isVideoLecture: { type: Boolean, required: true },
    isQuiz: { type: Boolean, required: true },
    videoUrl: { type: String },
    quiz: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Quiz' },
    reviews: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Review' }],
    duration: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const CourseSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    categories: [{ type: String, required: true }],
    price: { type: Number, required: true },
    estimatedPrice: { type: Number },
    thumbnailUrl: { type: String, required: true },
    tags: [{ type: String }],
    level: { type: String, required: true },
    demoUrl: { type: String },
    benefits: [{ type: String, required: true }],
    prerequisites: [{ type: String, required: true }],
    reviews: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Review' }],
    purchased: { type: Number, default: 0 },
    rating: { type: Number },
    lectures: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Lecture' }],
    roadmapPicUrl: { type: String },
    badges: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Badge" }],
    totalQuizzes: { type: Number, default: 0 },
    totalLectures: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const UserProgressSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course', required: true },
    lectureProgress: [{
            lectureId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Lecture', required: true },
            isCompleted: { type: Boolean, required: true },
            progressPercentage: { type: Number, required: true },
            quizStatus: {
                isPassed: { type: Boolean },
                score: { type: Number }
            }
        }],
    totalCompletedLectures: { type: Number, default: 0 },
    totalQuizzesPassed: { type: Number, default: 0 },
    streakUpdated: { type: Boolean, default: false },
    earnedBadges: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// Model Exports
exports.Review = mongoose_1.default.model('Review', ReviewSchema);
exports.Quiz = mongoose_1.default.model('Quiz', QuizSchema);
exports.Lecture = mongoose_1.default.model('Lecture', LectureSchema);
exports.Course = mongoose_1.default.model('Course', CourseSchema);
exports.UserProgress = mongoose_1.default.model('UserProgress', UserProgressSchema);
