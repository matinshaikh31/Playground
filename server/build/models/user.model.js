"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto")); // For password reset token generation
const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value) {
                return emailRegexPattern.test(value);
            },
            message: "please enter a valid email",
        },
        unique: true,
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            courseId: String, // Courses the user is currently enrolled in
        },
    ],
    completedCourses: [
        {
            courseId: String,
            completionDate: {
                type: Date,
                default: Date.now, // Store the date of completion
            },
        },
    ],
    badges: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Badge",
        default: [],
    },
    streaks: {
        type: Number,
        default: 0,
    },
    title: {
        type: String,
        default: "Newbie",
    },
    about: {
        type: String,
        default: "Hey there! I am a lifelong learner.",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date, // Expiration for reset token
}, { timestamps: true });
// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
// Sign access token
userSchema.methods.SignAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
        expiresIn: "5m",
    });
};
// Sign refresh token
userSchema.methods.SignRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
        expiresIn: "3d",
    });
};
// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto_1.default.randomBytes(20).toString("hex");
    // Hash and set resetPasswordToken field
    this.resetPasswordToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
    // Set expire time for reset token (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const userModel = mongoose_1.default.model("User", userSchema);
exports.default = userModel;
