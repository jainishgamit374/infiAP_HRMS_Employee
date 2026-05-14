const Notification = require("../models/notification.model");

/**
 * Create an in-app notification for a single user.
 * Safe to call from any controller; never throws (logs only).
 */
async function notifyUser({ recipient, category, headline, details, sentBy }) {
    try {
        if (!recipient || !category || !headline) return null;
        const doc = await Notification.create({
            category,
            recipient,
            headline: String(headline).trim(),
            details: String(details || "").trim() || String(headline).trim(),
            targetedAudience: "user",
            status: "Sent",
            sentCount: 1,
            sentBy,
            isActive: true,
        });
        return doc;
    } catch (err) {
        console.warn("notifyUser failed:", err && err.message);
        return null;
    }
}

module.exports = { notifyUser };
