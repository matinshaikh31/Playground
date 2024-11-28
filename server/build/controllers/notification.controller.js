"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotification = exports.getNotifications = void 0;
const notification_Model_1 = __importDefault(require("../models/notification.Model"));
const node_cron_1 = __importDefault(require("node-cron"));
// 1. Get all notifications (Admin only)
const getNotifications = async (req, res) => {
    try {
        const notifications = await notification_Model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
            error: error.message,
        });
    }
};
exports.getNotifications = getNotifications;
// 2. Update notification status (Admin only)
const updateNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notification = await notification_Model_1.default.findById(id);
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }
        // Update status to "read" if it's currently "unread"
        notification.status = "read";
        await notification.save();
        res.status(200).json({
            success: true,
            message: "Notification updated successfully",
            notification,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update notification",
            error: error.message,
        });
    }
};
exports.updateNotification = updateNotification;
// 3. Delete old notifications (Cron Job)
node_cron_1.default.schedule("0 0 * * *", async () => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        // Delete notifications older than 30 days with status "read"
        const result = await notification_Model_1.default.deleteMany({
            status: "read",
            createdAt: { $lt: thirtyDaysAgo },
        });
        console.log(`Deleted ${result.deletedCount} read notifications older than 30 days`);
    }
    catch (error) {
        console.error("Failed to delete old notifications", error.message);
    }
});
