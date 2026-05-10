// Role-Based Access Control
const verifyRole = (roles) => {
    return (req, res, next) => {
        let role = req.user?.role || "";

        // Normalize role names for comparison
        if (role === "main_admin" || role === "Main Admin" || role === "main admin") {
            role = "superadmin";
        } else if (role === "admin") {
            role = "admin";
        } else if (role === "hr") {
            role = "hr";
        } else if (role === "employee") {
            role = "employee";
        }

        if (req.user) {
            req.user.role = role;
        }

        if (!role || !roles.includes(role)) {
            return res
                .status(403)
                .json({ message: "Access Denied: Insufficient Permissions" });
        }
        next();
    };
};

module.exports = { verifyRole };
