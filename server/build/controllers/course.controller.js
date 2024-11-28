"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollInCourse = exports.getAllReviews = exports.deleteReview = exports.replyToReview = exports.createReview = exports.updateCourse = exports.evaluateQuiz = exports.deleteQuiz = exports.getQuizById = exports.createQuiz = exports.deleteLecture = exports.getLecturesForCourse = exports.deleteCourse = exports.getCourseById = exports.getAllCourses = exports.addLecture = exports.createCourse = void 0;
const course_model_1 = require("../models/course.model");
const course_model_2 = require("../models/course.model");
const course_model_3 = require("../models/course.model");
const course_model_4 = require("../models/course.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_5 = require("../models/course.model");
const mongoose_1 = __importDefault(require("mongoose"));
// Create a new course
const createCourse = async (req, res) => {
    try {
        const { name, description, categories, price, estimatedPrice, thumbnailUrl, tags, level, demoUrl, benefits, prerequisites, roadmapPicUrl } = req.body;
        const course = new course_model_1.Course({
            name,
            description,
            categories,
            price,
            estimatedPrice,
            thumbnailUrl,
            tags,
            level,
            demoUrl,
            benefits,
            prerequisites,
            roadmapPicUrl,
        });
        await course.save();
        res.status(201).json({ success: true, message: 'Course created successfully', course });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create course', error });
    }
};
exports.createCourse = createCourse;
// Add a lecture to a course
const addLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, thumbnailPicUrl, isVideoLecture, videoUrl, quizId, isQuiz, duration } = req.body;
        const course = await course_model_1.Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        const lecture = new course_model_2.Lecture({
            title,
            description,
            thumbnailPicUrl,
            isVideoLecture,
            isQuiz,
            videoUrl,
            quiz: quizId,
            duration,
        });
        await lecture.save();
        course.lectures.push(lecture._id);
        await course.save();
        res.status(201).json({ success: true, message: 'Lecture added successfully', lecture });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add lecture', error });
    }
};
exports.addLecture = addLecture;
// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await course_model_1.Course.find().populate('reviews').populate('lectures');
        res.status(200).json({ success: true, courses });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch courses', error });
    }
};
exports.getAllCourses = getAllCourses;
// Get a single course by ID
const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await course_model_1.Course.findById(courseId).populate('reviews').populate('lectures');
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, course });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch course', error });
    }
};
exports.getCourseById = getCourseById;
// Update a course
// export const updateCourse = async (req: Request, res: Response) => {
//   try {
//     const courseId = req.params.id;
//     const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, { new: true });
//     if (!updatedCourse) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }
//     res.status(200).json({ success: true, message: 'Course updated successfully', updatedCourse });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to update course', error });
//   }
// };
// Delete a course
const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const deletedCourse = await course_model_1.Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, message: 'Course deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete course', error });
    }
};
exports.deleteCourse = deleteCourse;
// Get lectures for a course (with authorization check)
const getLecturesForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await course_model_1.Course.findById(courseId).populate('lectures');
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, lectures: course.lectures });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch lectures', error });
    }
};
exports.getLecturesForCourse = getLecturesForCourse;
// Delete a lecture from a course
const deleteLecture = async (req, res) => {
    try {
        const { lectureId, courseId } = req.params;
        const course = await course_model_1.Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        await course_model_2.Lecture.findByIdAndDelete(lectureId);
        course.lectures = course.lectures.filter(lecture => lecture.toString() !== lectureId);
        await course.save();
        res.status(200).json({ success: true, message: 'Lecture deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete lecture', error });
    }
};
exports.deleteLecture = deleteLecture;
// Create a quiz
const createQuiz = async (req, res) => {
    try {
        const { questions, totalQuestions, passingScore } = req.body;
        const quiz = new course_model_3.Quiz({
            questions,
            totalQuestions,
            passingScore,
        });
        await quiz.save();
        res.status(201).json({ success: true, message: 'Quiz created successfully', quiz });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create quiz', error });
    }
};
exports.createQuiz = createQuiz;
// Get a quiz by ID
const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;
        const quiz = await course_model_3.Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }
        res.status(200).json({ success: true, quiz });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch quiz', error });
    }
};
exports.getQuizById = getQuizById;
// Delete a quiz
const deleteQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        await course_model_3.Quiz.findByIdAndDelete(quizId);
        res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete quiz', error });
    }
};
exports.deleteQuiz = deleteQuiz;
// Evaluate quiz results
const evaluateQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const quiz = await course_model_3.Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }
        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (question.correctAnswer === answers[index]) {
                score += 1;
            }
        });
        const result = {
            totalQuestions: quiz.questions.length,
            correctAnswers: score,
            scorePercentage: (score / quiz.questions.length) * 100,
        };
        res.status(200).json({ success: true, message: 'Quiz evaluated successfully', result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to evaluate quiz', error });
    }
};
exports.evaluateQuiz = evaluateQuiz;
const updateCourse = async (req, res) => {
    try {
        // Assuming your route is /api/courses/:id
        const { id } = req.params; // Use 'id' if route uses ':id'
        // Validate if the courseId (id) is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid course ID' });
        }
        // Find the course by its ID
        const course = await course_model_1.Course.findById(id); // Use 'id' here as well
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        // Proceed with updating the course (rest of the update logic)
        const { name, description, categories, price, thumbnailUrl, tags, level, benefits, prerequisites, lectures, badges, totalQuizzes, totalLectures, totalDuration } = req.body;
        // Update course fields
        if (name)
            course.name = name;
        if (description)
            course.description = description;
        if (categories)
            course.categories = categories;
        if (price)
            course.price = price;
        if (thumbnailUrl)
            course.thumbnailUrl = thumbnailUrl;
        if (tags)
            course.tags = tags;
        if (level)
            course.level = level;
        if (benefits)
            course.benefits = benefits;
        if (prerequisites)
            course.prerequisites = prerequisites;
        if (lectures)
            course.lectures = lectures;
        if (badges)
            course.badges = badges;
        if (totalQuizzes)
            course.totalQuizzes = totalQuizzes;
        if (totalLectures)
            course.totalLectures = totalLectures;
        if (totalDuration)
            course.totalDuration = totalDuration;
        // Save the updated course
        await course.save();
        return res.status(200).json({ success: true, message: 'Course updated successfully', course });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update course', error });
    }
};
exports.updateCourse = updateCourse;
// Create a review for a course or lecture
const createReview = async (req, res) => {
    try {
        const { userId, comment, rating, courseId, lectureId } = req.body; // Include courseId or lectureId
        if (!courseId && !lectureId) {
            return res.status(400).json({ success: false, message: 'Either courseId or lectureId must be provided' });
        }
        const review = new course_model_4.Review({
            user: userId,
            comment,
            rating,
        });
        await review.save();
        // Associate review with course or lecture
        if (courseId) {
            await course_model_1.Course.findByIdAndUpdate(courseId, { $push: { reviews: review._id } });
        }
        else if (lectureId) {
            await course_model_2.Lecture.findByIdAndUpdate(lectureId, { $push: { reviews: review._id } });
        }
        res.status(201).json({ success: true, message: 'Review created successfully', review });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create review', error });
    }
};
exports.createReview = createReview;
// Reply to a review
const replyToReview = async (req, res) => {
    try {
        const { reviewId, comment, user } = req.body;
        const review = await course_model_4.Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        // Create a new reply review document
        const reply = new course_model_4.Review({
            user: user,
            comment,
            commentReplies: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Save the reply
        await reply.save();
        // Add the reply ID to the commentReplies array of the parent review
        review.commentReplies?.push(reply._id);
        await review.save();
        res.status(200).json({ success: true, message: 'Replied to review successfully', reply });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to reply to review', error });
    }
};
exports.replyToReview = replyToReview;
// Delete a review
const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        await course_model_4.Review.findByIdAndDelete(reviewId);
        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete review', error });
    }
};
exports.deleteReview = deleteReview;
// Get all reviews for a specific course or lecture
const getAllReviews = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        let reviews;
        if (courseId) {
            // Find reviews related to the specified course
            const course = await course_model_1.Course.findById(courseId).populate('reviews');
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
            reviews = course.reviews;
        }
        else if (lectureId) {
            // Find reviews related to the specified lecture
            const lecture = await course_model_2.Lecture.findById(lectureId).populate('reviews');
            if (!lecture) {
                return res.status(404).json({ success: false, message: 'Lecture not found' });
            }
            reviews = lecture.reviews;
        }
        else {
            return res.status(400).json({ success: false, message: 'Either courseId or lectureId must be provided' });
        }
        res.status(200).json({ success: true, reviews });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch reviews', error });
    }
};
exports.getAllReviews = getAllReviews;
// Assume all models and schemas are imported and instantiated correctly
const enrollInCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body;
        // Find the user and course by their IDs
        const user = await user_model_1.default.findById(userId);
        const course = await course_model_1.Course.findById(courseId);
        // Ensure both user and course exist
        if (!user || !course) {
            return res.status(404).json({ message: "User or Course not found" });
        }
        // Check if the user is already enrolled in this course
        const alreadyEnrolled = user.courses.some((enrolledCourse) => enrolledCourse.courseId.toString() === courseId);
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "User is already enrolled in this course" });
        }
        // Add the course to the user's enrolled courses array
        user.courses.push({ courseId });
        // Increment the course's purchase count
        course.purchased += 1;
        // Save both user and course updates to the database
        await user.save();
        await course.save();
        // Create a UserProgress entry for tracking the user's progress in the course
        const userProgress = new course_model_5.UserProgress({
            userId: user._id,
            courseId: course._id,
            lectureProgress: [],
            totalCompletedLectures: 0,
            totalQuizzesPassed: 0,
            streakUpdated: false,
            earnedBadges: []
        });
        // Save the user progress document
        await userProgress.save();
        return res.status(200).json({
            message: "Enrollment successful",
            user,
            course,
            userProgress
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.enrollInCourse = enrollInCourse;
