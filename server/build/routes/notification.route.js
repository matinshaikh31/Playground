"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../controllers/notification.controller");
const nrouter = express_1.default.Router();
nrouter.get("/getNotification", notification_controller_1.getNotifications); // Fetch all notifications
nrouter.put("/updateNotification/:id", notification_controller_1.updateNotification); // Update notification status
exports.default = nrouter;
