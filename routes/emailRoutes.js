// const express = require('express');
// const router = express.Router();
// const nodemailer = require('nodemailer');

// // Create transporter for sending emails
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // Verify transporter configuration
// transporter.verify(function(error, success) {
//   if (error) {
//     console.error('SMTP connection error:', error);
//   } else {
//     console.log('SMTP connection successful');
//   }
// });

// // Contact form email route
// router.post('/send-contact', async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       service,
//       date,
//       time,
//       message
//     } = req.body;

//     // Validate required fields
//     if (!name || !email || !phone || !service) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Missing required fields' 
//       });
//     }

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: process.env.ADMIN_EMAIL,
//       subject: `New Contact Form Submission - ${service}`,
//       html: `
//         <h2>New Contact Form Submission</h2>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Phone:</strong> ${phone}</p>
//         <p><strong>Service:</strong> ${service}</p>
//         <p><strong>Date:</strong> ${date}</p>
//         <p><strong>Time:</strong> ${time}</p>
//         <p><strong>Message:</strong> ${message}</p>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ success: true, message: 'Email sent successfully' });
//   } catch (error) {
//     console.error('Email error details:', {
//       code: error.code,
//       command: error.command,
//       response: error.response
//     });
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to send email',
//       error: error.message
//     });
//   }
// });

// // Request quote email route
// router.post('/send-quote', async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       service,
//       preferredDate,
//       preferredTime,
//       message
//     } = req.body;

//     // Validate required fields
//     if (!name || !email || !phone || !service) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Missing required fields' 
//       });
//     }

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: process.env.ADMIN_EMAIL,
//       subject: `New Quote Request - ${service}`,
//       html: `
//         <h2>New Quote Request</h2>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Phone:</strong> ${phone}</p>
//         <p><strong>Service:</strong> ${service}</p>
//         <p><strong>Preferred Date:</strong> ${preferredDate}</p>
//         <p><strong>Preferred Time:</strong> ${preferredTime}</p>
//         <p><strong>Message:</strong> ${message}</p>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ success: true, message: 'Quote request sent successfully' });
//   } catch (error) {
//     console.error('Email error details:', {
//       code: error.code,
//       command: error.command,
//       response: error.response
//     });
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to send quote request',
//       error: error.message
//     });
//   }
// });

// module.exports = router;