const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user without password but with virtual fields
            req.user = await User.findById(decoded.id)
                .select("-password")
                .populate({
                    path: 'appointments',
                    options: { sort: { date: -1 } }
                })
                .populate({
                    path: 'orders',
                    options: { sort: { createdAt: -1 } }
                });

            if (!req.user) {
                return res.status(401).json({ msg: "User not found" });
            }

            next();
        } catch (err) {
            return res.status(401).json({ msg: "Token failed or expired" });
        }
    } else {
        res.status(401).json({ msg: "Not authorized, no token" });
    }
};

module.exports = protect;
