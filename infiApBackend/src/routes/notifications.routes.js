const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notifications.controller");

router.get("/", notificationsController.getNotifications);
router.get("/:id", notificationsController.getNotificationById);

module.exports = router;
