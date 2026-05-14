const LeaveApplication = require("../models/leaveApplication.model");
const User = require("../models/user.model");
const { notifyUser } = require("../utils/notifier");

const normalizeLeaveDate = (value) => {
    if (typeof value === "string") {
        const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (match) {
            return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
        }
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

const nextDate = (date) => {
    const value = new Date(date);
    value.setUTCDate(value.getUTCDate() + 1);
    return value;
};

const mapLeaveApplication = (leave) => ({
    LeaveApplicationMasterID: leave._id,
    EmployeeID: leave.EmployeeID,
    LeaveType: leave.LeaveType,
    ApprovalStatusID: leave.ApprovalStatusID,
    ApprovalStatus: leave.ApprovalStatus,
    ApprovalUsername: leave.ApprovalUsername,
    Reason: leave.Reason,
    StartDate: leave.StartDate,
    EndDate: leave.EndDate,
    IsHalfDay: leave.IsHalfDay,
    IsFirstHalf: leave.IsFirstHalf,
    CreatedBy: leave.CreatedBy,
    UpdatedBy: leave.UpdatedBy,
    CreatedDate: leave.createdAt,
    UpdatedDate: leave.updatedAt
});

const dedupeLeaveApplications = (leaves) => {
    const seen = new Set();
    return leaves.filter((leave) => {
        const key = [
            String(leave.EmployeeID),
            leave.LeaveType,
            leave.StartDate ? leave.StartDate.toISOString().split("T")[0] : "",
            leave.EndDate ? leave.EndDate.toISOString().split("T")[0] : "",
            leave.Reason,
            leave.ApprovalStatus
        ].join("|");

        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

// 1. Submit Leave Application (POST /leaveapplications/)
exports.applyLeave = async (req, res) => {
    try {
        const { LeaveType, Reason, StartDate, EndDate, IsHalfDay, IsFirstHalf } = req.body;
        
        const userId = req.user._id; 
        const normalizedStartDate = normalizeLeaveDate(StartDate);
        const normalizedEndDate = normalizeLeaveDate(EndDate);

        if (!LeaveType || !Reason || !normalizedStartDate || !normalizedEndDate) {
            return res.status(400).json({ status: "Error", message: "Leave type, reason, start date, and end date are required." });
        }

        if (normalizedEndDate < normalizedStartDate) {
            return res.status(400).json({ status: "Error", message: "End date cannot be before start date." });
        }

        const existingLeave = await LeaveApplication.findOne({
            EmployeeID: userId,
            LeaveType,
            Reason,
            StartDate: { $gte: normalizedStartDate, $lt: nextDate(normalizedStartDate) },
            EndDate: { $gte: normalizedEndDate, $lt: nextDate(normalizedEndDate) },
            ApprovalStatusID: { $in: [1, 3] }
        }).sort({ createdAt: -1 });

        if (existingLeave) {
            return res.status(200).json({
                status: "Success",
                message: "Leave application already exists.",
                data: mapLeaveApplication(existingLeave)
            });
        }

        const leaveApp = await LeaveApplication.create({
            EmployeeID: userId,
            LeaveType,
            Reason,
            StartDate: normalizedStartDate,
            EndDate: normalizedEndDate,
            IsHalfDay,
            IsFirstHalf,
            ApprovalStatusID: 3,
            ApprovalStatus: "Awaiting Approve",
            ApprovalUsername: "Main Admin", // You could logically infer this from the user's manager
            CreatedBy: userId,
            UpdatedBy: userId
        });

        res.status(200).json({
            status: "Success",
            message: "Leave application submitted successfully.",
            data: mapLeaveApplication(leaveApp)
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to apply for leave", error: error.message });
    }
};

// 2. Get Leave Application (GET /leaveapplications/)
exports.getLeaveApplications = async (req, res) => {
    try {
        const userId = req.user._id; 

        const leaves = await LeaveApplication.find({ EmployeeID: userId }).sort({ createdAt: -1 });

        if (!leaves.length) {
            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                data: []
            });
        }

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            data: dedupeLeaveApplications(leaves).map(mapLeaveApplication)
        });

    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to get leaves", error: error.message });
    }
};

// 3. Get Leave Approvals (GET /leaveapprovals/)
exports.getLeaveApprovals = async (req, res) => {
    try {
        // Mocking user ID for approver
        const approverId = req.user ? req.user._id : "656b23d91f4a9b2b2c3d4e5f"; 
        
        // Let's query pending leaves. For now, mock based on provided request:
        res.status(200).json({
            status: "Success",
            total_pending_approvals: 1,
            pending_approvals: [
                {
                    "Leave_ID": 9,
                    "employee_name": "Riya mishra",
                    "leave_type": "Sick Leave",
                    "start_date": "2026-01-18",
                    "end_date": "2026-01-18",
                    "reason": "Family function 111111..",
                    "profile_image": "/img/StoreGoogle_Play_TypeLight_LanguageEnglish3x.png",
                    "applied_on": "2026-01-16",
                    "IsHalfDay": false,
                    "IsFirstHalf": false
                }
            ]
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to get pending approvals", error: error.message });
    }
};

// 4. Approve / Reject Leave (POST /allapprove/)
exports.approveLeave = async (req, res) => {
    try {
        const { ProgramID, TranID, Reason, Action } = req.body;
        const approverID = req.user ? req.user._id : null;
        const approverName = (req.user && req.user.name) || "Approver";
        const isReject = String(Action || "").toLowerCase() === "reject";

        const updated = await LeaveApplication.findByIdAndUpdate(
            TranID,
            {
                ApprovalStatusID: isReject ? 4 : 1,
                ApprovalStatus: isReject ? "Rejected" : "Approved",
                ApproverID: approverID,
                ApprovalUsername: approverName,
            },
            { new: true }
        );

        if (updated && updated.EmployeeID) {
            const dateRange =
                updated.StartDate && updated.EndDate
                    ? ` (${new Date(updated.StartDate).toDateString()} - ${new Date(updated.EndDate).toDateString()})`
                    : "";
            await notifyUser({
                recipient: updated.EmployeeID,
                category: "leave",
                headline: isReject ? "Leave Request Rejected" : "Leave Request Approved",
                details: isReject
                    ? `Your ${updated.LeaveType} leave${dateRange} was rejected by ${approverName}.${Reason ? " Reason: " + Reason : ""}`
                    : `Your ${updated.LeaveType} leave${dateRange} has been approved by ${approverName}.`,
                sentBy: approverID,
            });
        }

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: isReject ? "Leave rejected." : "Approval updated successfully."
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to approve leave", error: error.message });
    }
};
