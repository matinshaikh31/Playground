"use strict";
// import express from "express";
// import {
//   addAnwser,
//   addQuestion,
//   addReplyToReview,
//   addReview,
//   deleteCourse,
//   editCourse,
//   generateVideoUrl,
//   getAdminAllCourses,
//   getAllCourses,
//   getCourseByUser,
//   getSingleCourse,
//   uploadCourse,
// } from "../controllers/course.controller";
// import { authorizeRoles, isAutheticated } from "../middleware/auth";
// const courseRouter = express.Router();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// courseRouter.post(
//   "/create-course",
//   isAutheticated,
//   authorizeRoles("admin"),
//   uploadCourse
// );
// courseRouter.put(
//   "/edit-course/:id",
//   isAutheticated,
//   authorizeRoles("admin"),
//   editCourse
// );
// courseRouter.get("/get-course/:id", getSingleCourse);
// courseRouter.get("/get-courses", getAllCourses);
// courseRouter.get(
//   "/get-admin-courses",
//   isAutheticated,
//   authorizeRoles("admin"),
//   getAdminAllCourses
// );
// courseRouter.get("/get-course-content/:id", isAutheticated, getCourseByUser);
// courseRouter.put("/add-question", isAutheticated, addQuestion);
// courseRouter.put("/add-answer", isAutheticated, addAnwser);
// courseRouter.put("/add-review/:id", isAutheticated, addReview);
// courseRouter.put(
//   "/add-reply",
//   isAutheticated,
//   authorizeRoles("admin"),
//   addReplyToReview
// );
// courseRouter.post("/getVdoCipherOTP", generateVideoUrl);
// courseRouter.delete(
//   "/delete-course/:id",
//   isAutheticated,
//   authorizeRoles("admin"),
//   deleteCourse
// );
// export default courseRouter;
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controllers/course.controller"); // Importing all controllers
const auth_1 = require("../middleware/auth"); // Assuming you have authentication middleware
const router = express_1.default.Router();
// Course Routes
router.post('/create', 
//isAutheticated,authorizeRoles('admin'), 
// isAutheticated,authorizeRoles('admin'), 
course_controller_1.createCourse);
// Create a new course
router.put('/update/:id', 
// isAutheticated,
// authorizeRoles('admin'), 
course_controller_1.updateCourse); // Update an existing course
router.delete('/delete/:id', auth_1.isAutheticated, (0, auth_1.authorizeRoles)('admin'), course_controller_1.deleteCourse); // Delete a course
router.get('/getAll', course_controller_1.getAllCourses); // Get all courses
router.get('/:id', course_controller_1.getCourseById); // Get a specific course by ID
// Lecture Routes
router.post('/:courseId/lecture/add', 
//  isAutheticated,
course_controller_1.addLecture); // Add a lecture to a course
router.get('/:courseId/lectures', auth_1.isAutheticated, course_controller_1.getLecturesForCourse); // Get all lectures of a course
router.delete('/:courseId/lecture/:lectureId', auth_1.isAutheticated, course_controller_1.deleteLecture); // Delete a lecture from a course
//courseEnrollement api 
router.post('/enroll', course_controller_1.enrollInCourse);
// Quiz Routes
router.post('/quiz/create', course_controller_1.createQuiz); // Create a quiz
router.get('/quiz/:id', 
//  isAutheticated,
course_controller_1.getQuizById);
router.delete('/quiz/:id', auth_1.isAutheticated, course_controller_1.deleteQuiz); // Delete a quiz
router.post('/quiz/evaluate', 
// isAutheticated,
course_controller_1.evaluateQuiz); // Evaluate a quiz
// Review Routes
router.post('/review/create', course_controller_1.createReview); // Create a review
router.post('/review/reply', course_controller_1.replyToReview); // Reply to a review
router.delete('/review/:id', course_controller_1.deleteReview); // Delete a review
router.get('/courses/:courseId/reviews', course_controller_1.getAllReviews); // For course reviews
router.get('/lectures/:lectureId/reviews', course_controller_1.getAllReviews); // For lecture reviews
exports.default = router;
