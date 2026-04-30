const express = require("express");
const router = express.Router();
const wfhController = require("../controllers/wfh.controller");

// Submit WFH request
router.post("/apply", wfhController.applyWFH);

// Get upcoming WFH for employee
router.get("/upcoming", wfhController.getUpcomingWFH);

module.exports = router;
