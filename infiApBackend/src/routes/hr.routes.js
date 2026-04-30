const express = require("express");
const router = express.Router();
const hrController = require("../controllers/hr.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { verifyRole } = require("../middlewares/role.middleware");

// All HR routes require authentication
router.use(verifyJWT);

// -> Welcome Page
router.get("/dashboard/summary", hrController.getDashboardSummary);
router.get("/profile", hrController.getHRAdminProfile);

// -> Employee
router.get("/employees", hrController.getAllEmployees);
router.post("/employees", verifyRole(["hr", "admin", "main_admin"]), hrController.addEmployee);
router.put("/employees/:id", verifyRole(["hr", "admin", "main_admin"]), hrController.editEmployee);
router.get("/employees/:id/profile", hrController.getEmployeeProfile);

// -> Attendance (Detailed)
router.get("/attendance/daily-overview", hrController.getAttendanceDailyOverview);
router.get("/attendance/records", hrController.getCheckInRecords);
router.post("/attendance/correction/submit", hrController.submitCorrectionRequest);
router.get("/attendance/correction/requests", hrController.getCorrectionRequests);
router.put("/attendance/correction/review", verifyRole(["hr", "admin", "main_admin"]), hrController.reviewCorrectionRequest);
router.get("/attendance/notifications", hrController.getAttendanceNotifications);
router.get("/attendance/reports", hrController.getAttendanceReports);
router.post("/attendance/generate-report", verifyRole(["hr", "admin", "main_admin"]), hrController.generateAttendanceReport);

// -> Leaves
router.get("/leaves/stats", hrController.getLeaveStats);
router.get("/leaves/pending-detailed", hrController.getPendingLeavesDetailed);
router.get("/leaves/applications", hrController.getLeaveApplications);
router.get("/leaves/today", hrController.getEmployeesOnLeaveToday);
router.get("/leaves/requests", hrController.getLeaveRequests);
router.put("/leaves/approve", verifyRole(["hr", "admin", "main_admin", "manager"]), hrController.approveLeave);
router.get("/leaves/history", hrController.getLeaveHistory);
router.post("/leaves/generate-report", verifyRole(["hr", "admin", "main_admin"]), hrController.generateLeaveReport);

// -> Recruitment
router.get("/recruitment/candidates/tracking", hrController.getCandidateTrackingList);
router.get("/recruitment/candidates/review", hrController.getReviewApplications);
router.get("/recruitment/candidates/recent", hrController.getRecentCandidatesDetail);
router.get("/recruitment/candidates/:id/profile", hrController.getCandidateProfile);
router.put("/recruitment/candidates/:id/schedule-interview", verifyRole(["hr", "admin", "main_admin"]), hrController.scheduleTechnicalInterview);
router.put("/recruitment/candidates/:id/shortlist", verifyRole(["hr", "admin", "main_admin"]), hrController.shortlistCandidate);
router.put("/recruitment/candidates/:id/reject", verifyRole(["hr", "admin", "main_admin"]), hrController.rejectCandidate);
router.put("/recruitment/candidates/:id/interview", verifyRole(["hr", "admin", "main_admin"]), hrController.updateTechnicalInterview);
router.put("/recruitment/candidates/:id/select", verifyRole(["hr", "admin", "main_admin"]), hrController.selectCandidate);
router.post("/recruitment/candidates/:id/offer", verifyRole(["hr", "admin", "main_admin"]), hrController.sendOfferLetter);
router.get("/recruitment/jobs", hrController.getJobs);
router.post("/recruitment/jobs", verifyRole(["hr", "admin", "main_admin"]), hrController.addJob);

// -> Performance
router.get("/performance/dashboard", hrController.getPerformanceDashboard);
router.get("/performance/list", hrController.getPerformanceList);
router.get("/performance/feedback/stats", hrController.getPerformanceFeedbackStats);
router.get("/performance/feedback/recent", hrController.getRecentFeedbackList);
router.get("/performance/report/summary", hrController.getPerformanceReportSummary);
router.get("/performance/report/trends", hrController.getPerformanceTrends);
router.post("/performance/report/generate", verifyRole(["hr", "admin", "main_admin"]), hrController.generatePerformanceReport);
router.post("/performance/feedback", verifyRole(["hr", "admin", "main_admin", "manager"]), hrController.addFeedback);

// -> Finance
router.get("/finance/salary-list", verifyRole(["hr", "admin", "main_admin"]), hrController.getSalaryProcessingList);
router.get("/finance/payroll", verifyRole(["hr", "admin", "main_admin"]), hrController.getSalaryProcessingList); // keeping old path as alias
router.post("/finance/salary/process", verifyRole(["hr", "admin", "main_admin"]), hrController.processSalary);
router.get("/finance/payslip/:id", hrController.getPayslip);

// -> Resignation
router.post("/resignation", hrController.submitResignation);
router.get("/resignation/register", hrController.getResignations);
router.put("/resignation/exit-process", verifyRole(["hr", "admin", "main_admin"]), hrController.processExit);

// -> Analytics
router.get("/analytics/report", hrController.getAnalyticsReport);
router.get("/analytics/attendance", hrController.getAttendanceAnalytics);
router.get("/analytics/performance", hrController.getPerformanceAnalytics);

module.exports = router;
