const WFHRequest = require("../models/wfh.model");
const moment = require("moment");

exports.applyWFH = async (req, res) => {
  try {
    const { date, duration, reason } = req.body;
    const employeeId = req.user ? req.user._id : req.body.employeeId || null;

    if (!employeeId) return res.status(400).json({ status: "Error", message: "employeeId required" });
    if (!date) return res.status(400).json({ status: "Error", message: "date required" });

    const wfh = await WFHRequest.create({
      employeeId,
      date: moment(date).toDate(),
      duration: duration || "Full Day",
      reason,
      createdBy: employeeId
    });

    return res.status(200).json({ status: "Success", message: "WFH request submitted", data: { id: wfh._id } });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: "Failed to submit WFH request", error: error.message });
  }
};

exports.getUpcomingWFH = async (req, res) => {
  try {
    const employeeId = req.user ? req.user._id : req.query.employeeId || null;
    if (!employeeId) return res.status(400).json({ status: "Error", message: "employeeId required" });

    const today = moment().startOf('day').toDate();
    const upcoming = await WFHRequest.find({ employeeId, date: { $gte: today } }).sort({ date: 1 }).limit(50);

    const data = upcoming.map((w) => ({
      id: w._id,
      date: w.date,
      duration: w.duration,
      reason: w.reason,
      status: w.status
    }));

    return res.status(200).json({ status: "Success", data });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: "Failed to get upcoming WFH", error: error.message });
  }
};
