require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConfig");
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin:['http://localhost:5173','https://syntrad-frontend.vercel.app'],
  credentials:true
}))

// Explicitly handle preflight OPTIONS requests for all routes
app.options('*', cors({
  origin:['http://localhost:5173','https://syntrad-frontend.vercel.app'],
  credentials:true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Performance middleware
app.use(compression());
app.use(express.json()); // for parsing application/json

// Routes
app.use("/api", require("./routes/auth"));
// app.use("/api/email", require("./routes/emailRoutes")); // Add email routes
app.use("/api/reviews", require("./routes/reviewRoutes")); // Add review routes
app.use("/api/dashboard", require("./routes/dashboardRoutes")); // Add dashboard routes
app.use("/api/appointments", require("./routes/appointmentRoutes")); // Add appointment routes
app.use("/api/products", require("./routes/productRoutes")); // Add product routes
app.use("/api/orders", require("./routes/orderRoutes")); // Add order routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Only listen if not in Vercel serverless
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
