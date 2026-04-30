const RESEND_API_URL = process.env.RESEND_API_URL || "https://api.resend.com/emails";
const DEFAULT_FROM_EMAIL = "InfiAP HRMS <onboarding@resend.dev>";

const isConfiguredForEmail = () => {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
        return false;
    }

    const placeholderValues = [apiKey, fromEmail].some((value) =>
        typeof value === "string" &&
        (value.includes("your_resend") || value.includes("example.com"))
    );

    return !placeholderValues;
};

const sendEmail = async ({ to, subject, html }) => {
    if (!isConfiguredForEmail()) {
        console.warn("Resend not configured. Skipping email delivery.");
        return false;
    }

    const response = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Resend API error:", errorText);
        throw new Error("Could not send email");
    }

    return true;
};

const sendVerificationEmail = async (email, token) => {
    try {
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
        const emailSent = await sendEmail({
            to: email,
            subject: "Verify Your Email - InfiAP HRMS",
            html: `
                <h1>Email Verification</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationLink}">${verificationLink}</a>
                <p>This link will expire in 24 hours.</p>
            `,
        });

        if (emailSent) {
            console.log(`Verification email sent to ${email}`);
        }

        return emailSent;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Could not send verification email");
    }
};

const sendLoginOTPEmail = async (email, otp) => {
    try {
        const emailSent = await sendEmail({
            to: email,
            subject: "Your InfiAP login verification code",
            html: `
                <h1>Secure Login Code</h1>
                <p>Your 6-digit verification code is:</p>
                <h2 style="letter-spacing: 4px;">${otp}</h2>
                <p>This code will expire in 10 minutes.</p>
            `,
        });

        if (emailSent) {
            console.log(`Login OTP email sent to ${email}`);
        }

        return emailSent;
    } catch (error) {
        console.error("Error sending login OTP email:", error);
        throw new Error("Could not send login OTP email");
    }
};

const sendBookingConfirmationEmail = async (email, name, date) => {
    try {
        await sendEmail({
            to: email,
            subject: "Meeting Request Received - InfiAP HRMS",
            html: `
                <h1>Meeting Request Received</h1>
                <p>Hi ${name},</p>
                <p>We have received your request for a meeting on <strong>${new Date(date).toLocaleString()}</strong>.</p>
                <p>Our team will review it and send you a Google Meet link shortly.</p>
                <br>
                <p>Best Regards,<br>AbhiProject Team</p>
            `,
        });
        console.log(`Booking confirmation email sent to ${email}`);
    } catch (error) {
        console.error("Error sending booking email:", error);
        // Don't throw error here so booking process doesn't fail if email fails
    }
};

const sendMeetingLinkEmail = async (email, name, date, link) => {
    try {
        await sendEmail({
            to: email,
            subject: "Meeting Confirmed - InfiAP HRMS",
            html: `
                <h1>Meeting Confirmed</h1>
                <p>Hi ${name},</p>
                <p>Your meeting has been confirmed for <strong>${new Date(date).toLocaleString()}</strong>.</p>
                <p>You can join using the link below:</p>
                <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Join Google Meet</a>
                <p>Or copy this link: ${link}</p>
                <br>
                <p>Best Regards,<br>AbhiProject Team</p>
            `,
        });
        console.log(`Meeting link email sent to ${email}`);
    } catch (error) {
        console.error("Error sending meeting link email:", error);
    }
};

module.exports = {
    sendVerificationEmail,
    sendLoginOTPEmail,
    sendBookingConfirmationEmail,
    sendMeetingLinkEmail,
    isConfiguredForEmail,
};
