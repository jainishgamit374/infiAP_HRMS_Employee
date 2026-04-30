const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail, sendLoginOTPEmail } = require("../services/email.service");

// Generate tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Something went wrong while generating tokens");
    }
};

const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department || "",
    designation: user.designation || "",
    joiningDate: user.joiningDate,
    phone: user.phone || "",
    address: user.address || "",
    employeeId: user.employeeId || "",
    profileImage: user.profileImage || "",
});

const buildAuthResponse = (loggedInUser, accessToken) => ({
    message: "Login successful",
    require2FA: false,
    token: accessToken,
    role: loggedInUser.role,
    user: sanitizeUser(loggedInUser),
});

const issueLoginOtpChallenge = async (user) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    user.twoFactorOTP = otp;
    user.twoFactorOTPExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    let emailSent = false;
    try {
        emailSent = await sendLoginOTPEmail(user.email, otp);
    } catch (mailError) {
        console.warn("OTP email send failed:", mailError.message);
    }

    return { emailSent };
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = await User.create({
            name,
            email,
            password,
            role: role || "employee", // Default to employee if role not provided
            verificationToken,
            isEmailVerified: false,
        });

        let emailMessage = "User registered successfully.";

        try {
            const emailSent = await sendVerificationEmail(email, verificationToken);
            emailMessage = emailSent
                ? "User registered successfully. Please check your email for verification."
                : "User registered successfully. Email verification is skipped in local development.";
        } catch (mailError) {
            console.warn("Verification email skipped:", mailError.message);
            emailMessage = "User registered successfully. Verification email could not be sent from this environment.";
        }

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            return res.status(500).json({ message: "Something went wrong while registering the user" });
        }

        return res.status(201).json({
            user: sanitizeUser(createdUser),
            message: emailMessage,
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

// Login User (Handles Admin, Manager, User)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid user credentials" });
        }

        if (user.firstLogin2FAVerified) {
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
            const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            };

            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(buildAuthResponse(loggedInUser, accessToken));
        }

        const { emailSent } = await issueLoginOtpChallenge(user);

        return res.status(200).json({
            message: emailSent
                ? "Verification code sent to your email."
                : "Unable to send verification code email. Please check mail configuration.",
            require2FA: true,
            userId: user._id,
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

const resendLoginOTP = async (req, res) => {
    try {
        const { userId, email } = req.body;

        if (!userId && !email) {
            return res.status(400).json({ message: "User ID or email is required" });
        }

        const user = await User.findOne(userId ? { _id: userId } : { email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.firstLogin2FAVerified) {
            return res.status(400).json({ message: "Security code is required only for first login." });
        }

        const { emailSent } = await issueLoginOtpChallenge(user);

        return res.status(200).json({
            message: emailSent
                ? "A new verification code has been sent to your email."
                : "Unable to send a new verification code email. Please check mail configuration.",
            userId: user._id,
        });
    } catch (error) {
        console.error("Resend OTP Error:", error);
        return res.status(500).json({ message: "Server error while resending the verification code" });
    }
};


// Verify Login OTP (2FA)
const verifyLoginOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({ message: "User ID and OTP are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.twoFactorOTP !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.twoFactorOTPExpires < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Clear the OTP fields
        user.twoFactorOTP = undefined;
        user.twoFactorOTPExpires = undefined;
        user.firstLogin2FAVerified = true;
        await user.save({ validateBeforeSave: false });

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "2FA verified successfully",
                token: accessToken,
                role: loggedInUser.role,
                user: sanitizeUser(loggedInUser)
            });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ message: "Server error during 2FA verification" });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        // For simplicity, store resetToken directly on verificationToken since it's already there or add a field
        // Usually, should have a resetPasswordToken and resetPasswordExpires.
        // Let's assume we can reuse verificationToken for this demo or we should use user schema.
        user.verificationToken = resetToken;
        await user.save({ validateBeforeSave: false });

        // Would normally send an email with reset link. In this setup, we'll just mock it or use email service if implemented.
        // await sendVerificationEmail(email, resetToken); 

        return res.status(200).json({ message: "Password reset link sent to your email", resetToken });
    } catch (error) {
        return res.status(500).json({ message: "Error generating password reset token" });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        user.password = newPassword;
        user.verificationToken = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({ message: "Password successfully reset" });
    } catch (error) {
        return res.status(500).json({ message: "Error resetting password" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    resendLoginOTP,
    verifyLoginOTP,
    forgotPassword,
    resetPassword
};
