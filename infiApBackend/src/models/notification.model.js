const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            enum: ["announcement", "policy", "alert"],
            required: true
        },
        headline: {
            type: String,
            required: true,
            trim: true
        },
        details: {
            type: String,
            required: true,
            trim: true
        },
        targetedAudience: {
            type: String,
            enum: ["all_employee", "department", "hr"],
            required: true
        },
        targetDepartments: [{
            type: String,
            trim: true
        }],
        scheduleAt: {
            type: Date
        },
        status: {
            type: String,
            enum: ["Draft", "Scheduled", "Sent"],
            default: "Sent"
        },
        sentCount: {
            type: Number,
            default: 0,
            min: 0
        },
        resentCount: {
            type: Number,
            default: 0,
            min: 0
        },
        isActive: {
            type: Boolean,
            default: true
        },
        sentBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
