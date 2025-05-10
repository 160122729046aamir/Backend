// controllers/appointmentController.js

const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const mongoose = require('mongoose');

const {
  EMAIL_USER,
  ADMIN_EMAIL,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN
} = process.env;

// OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({ refresh_token: OAUTH_REFRESH_TOKEN });

// Create transporter with fresh access token
async function createTransporter() {
  const { token: accessToken } = await oauth2Client.getAccessToken();
  if (!accessToken) throw new Error('Failed to retrieve access token');

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      type: 'OAuth2',
      user: EMAIL_USER,
      clientId: OAUTH_CLIENT_ID,
      clientSecret: OAUTH_CLIENT_SECRET,
      refreshToken: OAUTH_REFRESH_TOKEN,
      accessToken
    }
  });
}

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      service,
      date,
      time,
      message,
      isQuoteRequest
    } = req.body;

    // Find the service by category if a string is provided
    let serviceId = service;
    
    // Check if service is a string and not already an ObjectId
    if (typeof service === 'string' && !mongoose.Types.ObjectId.isValid(service)) {
      const serviceDoc = await Service.findOne({ category: service });
      if (!serviceDoc) {
        return res.status(404).json({
          success: false,
          message: `Service "${service}" not found`
        });
      }
      serviceId = serviceDoc._id;
    }

    // Check if an appointment already exists for this service, date and time
    const existingAppointment = await Appointment.findOne({
      service: serviceId,
      date: new Date(date),
      time: time
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please select a different time or date.',
        isConflict: true
      });
    }

    // Persist to database
    const appointment = await Appointment.create({
      name, 
      email, 
      phone, 
      service: serviceId, 
      date, 
      time, 
      message, 
      isQuoteRequest,
      iterations: [{
        date,
        time,
        status: 'pending'
      }]
    });

    // For display purposes in email, get the service name
    let serviceName = service;
    if (mongoose.Types.ObjectId.isValid(serviceId)) {
      const serviceDoc = await Service.findById(serviceId);
      if (serviceDoc) {
        serviceName = serviceDoc.category;
      }
    }

    // Email to admin
    const adminMail = {
      from: EMAIL_USER,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `New ${isQuoteRequest ? 'Quote Request' : 'Appointment'} — ${serviceName}`,
      html: `
        <h2>New ${isQuoteRequest ? 'Quote Request' : 'Appointment'}</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Message:</strong> ${message || 'No message provided'}</p>
      `
    };

    // Confirmation to user
    const userMail = {
      from: EMAIL_USER,
      to: email,
      subject: `Your ${isQuoteRequest ? 'Quote Request' : 'Appointment'} Confirmation`,
      html: `
        <h2>Thank you for your ${isQuoteRequest ? 'quote request' : 'appointment booking'}!</h2>
        <p>We have received your request and will process it shortly.</p>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>We will contact you soon to confirm the details.</p>
        <p>Best regards,<br>Syntrad Team</p>
      `
    };

    // Send emails
    const transporter = await createTransporter();
    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    res.status(201).json({
      success: true,
      message: `${isQuoteRequest ? 'Quote request' : 'Appointment'} created successfully`,
      appointment
    });
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

// Add a new iteration to an appointment
exports.addIteration = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { date, time, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Add new iteration
    appointment.iterations.push({
      date,
      time,
      notes,
      status: 'pending'
    });
    appointment.iterationCount += 1;

    await appointment.save();

    // Send email notifications
    const transporter = await createTransporter();
    
    const adminMail = {
      from: EMAIL_USER,
      to: ADMIN_EMAIL,
      subject: `New Iteration Added - ${appointment.service}`,
      html: `
        <h2>New Iteration Added</h2>
        <p><strong>Appointment ID:</strong> ${appointmentId}</p>
        <p><strong>Client:</strong> ${appointment.name}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Notes:</strong> ${notes || 'No notes provided'}</p>
      `
    };

    const userMail = {
      from: EMAIL_USER,
      to: appointment.email,
      subject: 'Follow-up Appointment Scheduled',
      html: `
        <h2>Follow-up Appointment Scheduled</h2>
        <p>Dear ${appointment.name},</p>
        <p>A follow-up appointment has been scheduled for your service.</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Notes:</strong> ${notes || 'No notes provided'}</p>
      `
    };

    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    res.json({
      success: true,
      message: 'Iteration added successfully',
      appointment
    });
  } catch (error) {
    console.error('Add iteration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add iteration',
      error: error.message
    });
  }
};

// Update iteration status
exports.updateIterationStatus = async (req, res) => {
  try {
    const { appointmentId, iterationIndex } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (!appointment.iterations[iterationIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Iteration not found'
      });
    }

    appointment.iterations[iterationIndex].status = status;
    await appointment.save();

    res.json({
      success: true,
      message: 'Iteration status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update iteration status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update iteration status',
      error: error.message
    });
  }
};

// Get all appointments (admin only)
exports.getAppointments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Fetch appointments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointments', error: error.message });
  }
};

// Get user's own appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment
      .find({ email: req.user.email })
      .sort({ createdAt: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Fetch my appointments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching your appointments', error: error.message });
  }
};

// Update appointment status (admin only) + notify user
exports.updateAppointmentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Status update email
    const statusMail = {
      from: EMAIL_USER,
      to: appointment.email,
      subject: 'Appointment Status Update',
      html: `
        <h2>Your Appointment Status Has Been Updated</h2>
        <p>Your appointment for <strong>${appointment.service}</strong> has been <strong>${status}</strong>.</p>
        <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <p>If you have any questions, please contact us.</p>
        <p>Best regards,<br>Syntrad Team</p>
      `
    };

    const transporter = await createTransporter();
    await transporter.sendMail(statusMail);

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Error updating appointment status', error: error.message });
  }
};
