const User = require('../models/User');
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');

exports.getUserDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        // Get appointments count
        const appointments = await Appointment.find({ user: userId });
        const appointmentStats = {
            completed: appointments.filter(a => a.status === 'completed').length,
            pending: appointments.filter(a => a.status === 'pending').length,
            cancelled: appointments.filter(a => a.status === 'cancelled').length
        };

        // Get orders and total spent
        const orders = await Order.find({ user: userId });
        const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);
        
        // Get monthly order data
        const monthlyOrders = await Order.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    value: { $sum: "$total" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Base stats for all users
        const dashboardData = {
            stats: {
                appointments: appointments.length,
                orders: orders.length,
                totalSpent: totalSpent
            },
            appointmentData: [
                { name: 'Completed', value: appointmentStats.completed },
                { name: 'Pending', value: appointmentStats.pending },
                { name: 'Cancelled', value: appointmentStats.cancelled }
            ],
            orderData: monthlyOrders.map(order => ({
                name: new Date(0, order._id - 1).toLocaleString('default', { month: 'short' }),
                value: order.value
            }))
        };

        // Add admin-specific stats
        if (userRole === 'admin') {
            const totalUsers = await User.countDocuments();
            const totalRevenue = await Order.aggregate([
                { $group: { _id: null, total: { $sum: "$total" } } }
            ]);

            // Get monthly revenue and user data for admin
            const monthlyStats = await Order.aggregate([
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        revenue: { $sum: "$total" },
                        users: { $addToSet: "$user" }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            dashboardData.stats.totalUsers = totalUsers;
            dashboardData.stats.totalRevenue = totalRevenue[0]?.total || 0;
            dashboardData.adminRevenueData = monthlyStats.map(stat => ({
                name: new Date(0, stat._id - 1).toLocaleString('default', { month: 'short' }),
                revenue: stat.revenue,
                users: stat.users.length
            }));
        }

        res.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
};