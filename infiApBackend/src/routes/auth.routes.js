const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    resendLoginOTP,
    forgotPassword,
    resetPassword,
    verifyLoginOTP
} = require("../controllers/user.controller");

// Public auth routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/resend-2fa", resendLoginOTP);
router.post("/verify-2fa", verifyLoginOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
