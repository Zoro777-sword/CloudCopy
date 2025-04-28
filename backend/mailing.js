require("dotenv").config();
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Debugging: Check if environment variables are loading
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ ERROR: Missing EMAIL_USER or EMAIL_PASS in .env file.");
  process.exit(1); // Stop execution if missing
}

// Enable CORS for frontend communication
app.use(cors());
app.use(express.static("public"));

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Nodemailer setup with proper configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 465 for SSL, or 587 for TLS
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Test SMTP connection
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Error:", error);
  } else {
    console.log("✅ SMTP Server is ready to send emails.");
  }
});

// 📩 API Route to handle file upload & email sending
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL, // Static receiver email
    subject: "📎 New Document Uploaded",
    text: "A new file has been uploaded. See the attachment.",
    attachments: [{ filename: req.file.originalname, path: req.file.path }],
  };

  try {
    await transporter.sendMail(mailOptions);
    fs.unlinkSync(req.file.path); // Delete file after sending
    res.status(200).send("✅ File sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).send("Error sending email.");
  }
});

// 🚀 Start the server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
