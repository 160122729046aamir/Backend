require("dotenv").config();
const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const app = express();
const connectDB = require("./config/dbConfig");

// Enhanced logging for debugging Vercel serverless issues
console.log('Starting server...');

// Connect to MongoDB with error handling, then start server setup
(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connection successful.');

    // Security middleware
    app.use(helmet());
    app.use(cors({
      origin:['http://localhost:5173','https://syntrad-frontend.vercel.app'],
      credentials:true
    }))    // Explicitly handle preflight OPTIONS requests for all routes
    // app.options('*', cors({
    //   origin:['http://localhost:5173','https://syntrad-frontend.vercel.app'],
    //   credentials:true
    // }));

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

    // Allowed origins for CORS
    const allowedOrigins = ['http://localhost:5173', 'https://syntrad-frontend.vercel.app'];

    // Catch-all for 404s and ensure CORS headers are set
    app.use((req, res, next) => {
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      }
      next();
    });

    // Error handling middleware (ensure CORS headers)
    app.use((err, req, res, next) => {
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      console.error('Error middleware:', err.message, err.stack);
      res.status(500).json({ message: 'Something went wrong!', error: err.message, stack: err.stack });
    });

    // Only listen if not in Vercel serverless
    if (process.env.VERCEL !== '1') {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    // In serverless, throw to trigger 500
    throw err;
  }
})();

module.exports = app;
