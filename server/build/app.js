"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const badge_route_1 = __importDefault(require("./routes/badge.route"));
const express_rate_limit_1 = require("express-rate-limit");
const userProgress_route_1 = __importDefault(require("./routes/userProgress.route"));
const analytic_route_1 = __importDefault(require("./routes/analytic.route"));
// body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
// cookie parser
exports.app.use((0, cookie_parser_1.default)());
// cors => cross origin resource sharing
// origin: process.env.ORIGIN,
exports.app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
}));
// app.use(cors({ origin: process.env.ORIGIN, credentials: true, }))
// api requests limit
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
// routes
exports.app.use("/api/v1", analytic_route_1.default, notification_route_1.default, user_route_1.default, order_route_1.default, course_route_1.default, badge_route_1.default, userProgress_route_1.default);
// testing api
exports.app.get("/test", (req, res, next) => {
    res.status(200).json({
        succcess: true,
        message: "API is working",
    });
});
// unknown route
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
// middleware calls
exports.app.use(limiter);
exports.app.use(error_1.ErrorMiddleware);