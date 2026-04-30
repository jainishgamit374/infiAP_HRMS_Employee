const Notification = require("../models/notification.model");

exports.getNotifications = async (req, res) => {
  try {
    // For simplicity, return most recent 50 notifications
    const notifications = await Notification.find({ isActive: true }).sort({ createdAt: -1 }).limit(50);
    const data = notifications.map(n => ({ id: n._id, category: n.category, headline: n.headline, details: n.details, scheduleAt: n.scheduleAt, status: n.status }));
    return res.status(200).json({ status: "Success", data });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: "Failed to fetch notifications", error: error.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const n = await Notification.findById(id);
    if (!n) return res.status(404).json({ status: "Error", message: "Notification not found" });
    return res.status(200).json({ status: "Success", data: n });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: "Failed to fetch notification", error: error.message });
  }
};
