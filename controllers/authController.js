// controllers/authController.js
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
    const { username, password , email, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        user = new User({ username, password, email });
        if (role){
            user.role=role
        }
        await user.save();

        const token = generateToken(user._id);
        res.json({ token, expiresIn: 3600*7*24, user: { id: user._id, username: user.username, role: user.role, email: user.email } });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = generateToken(user._id);
        res.json({ 
            token, 
            expiresIn: 7*24*3600, 
            user: { 
                id: user._id, 
                username: user.username, 
                role: user.role, 
                email: user.email,
                profileImage: user.profileImage 
            } 
        });
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ msg: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, currentPassword, newPassword, profileImage } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update name if provided
        if (name) {
            user.username = name;
        }

        // Update password if provided
        if (currentPassword && newPassword) {
            // Verify current password
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            user.password = newPassword;
        }

        // Update profile image if provided
        if (profileImage) {
            user.profileImage = profileImage;
        }

        await user.save();

        res.json({ 
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
