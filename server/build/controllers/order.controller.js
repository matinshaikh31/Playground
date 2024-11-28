"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.sendStripePublishableKey = exports.getAllOrders = exports.createOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const order_Model_1 = __importDefault(require("../models/order.Model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = require("../models/course.model");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notification_Model_1 = __importDefault(require("../models/notification.Model"));
const order_service_1 = require("../services/order.service");
const redis_1 = require("../utils/redis");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// Create Order using Stripe Session
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId, sessionId } = req.body;
        // Validate the Stripe session ID
        if (!sessionId) {
            return next(new ErrorHandler_1.default("Stripe session ID is required", 400));
        }
        // Check if the session ID is already used in an order
        const existingOrder = await order_Model_1.default.findOne({ "payment_info.id": sessionId });
        if (existingOrder) {
            return res.status(400).json({
                success: false,
                message: "This payment session has already been used. Default or duplicate payment detected.",
            });
        }
        // Retrieve Stripe session
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        // Ensure the payment is completed
        if (session.payment_status !== "paid") {
            return next(new ErrorHandler_1.default("Payment not authorized!", 400));
        }
        const user = await user_model_1.default.findById(req.user?._id);
        // Check if the user already purchased the course
        const courseExistInUser = user?.courses.some((course) => course._id.toString() === courseId);
        if (courseExistInUser) {
            return next(new ErrorHandler_1.default("You have already purchased this course", 400));
        }
        // Fetch course details
        const course = await course_model_1.Course.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        // Prepare order data
        const orderData = {
            courseId: course._id,
            userId: user?._id,
            payment_info: {
                id: session.id,
                amount_total: session.amount_total,
                currency: session.currency,
            },
        };
        // Prepare email data for order confirmation
        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            },
        };
        // Send order confirmation email
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });
        try {
            if (user) {
                await (0, sendMail_1.default)({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
            }
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        // Add course to user's purchased courses
        user?.courses.push(course._id);
        await user?.save();
        // Cache updated user data in Redis
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        // Create a notification for the user
        await notification_Model_1.default.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order for the course: ${course.name}`,
        });
        // Increment purchased count for the course
        course.purchased = course.purchased + 1;
        await course.save();
        // Create the new order
        await order_Model_1.default.create(orderData);
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            customer_details: {
                email: user?.email
            },
            id: session.id,
            amount_total: course.price
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get all orders for admin
exports.getAllOrders = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        (0, order_service_1.getAllOrdersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Send Stripe publishable key
exports.sendStripePublishableKey = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res) => {
    res.status(200).json({
        publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});
exports.Payment = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    const { courses } = req.body; // courses array should contain course details like name, price, etc.
    // Create line items from the courses array
    const lineItems = courses.map((course) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: course.name,
                images: [course.imgUrl], // Course image URL
            },
            unit_amount: course.price, // Convert price to cents (Stripe expects cents)
        },
        quantity: 1, // Assuming one course per transaction, but you can update based on your use case
    }));
    try {
        // Create the Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `http://localhost:5173/${courses[0].id}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://localhost:5173/cancel",
        });
        // Send the session ID to the frontend
        res.json({ id: session.id });
    }
    catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        next(error); // Call next middleware for error handling
    }
});
