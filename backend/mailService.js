const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail app password
    }
});

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

async function sendEmailWithAttachments(req, res) {
    try {
        const { images, printSettings } = req.body;

        if (!images || !printSettings) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Create a temporary directory for attachments
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // Process images and create attachments
        const attachments = await Promise.all(images.map(async (image, index) => {
            const base64Data = image.src.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const filename = `document${index + 1}.png`;
            const filePath = path.join(tempDir, filename);
            
            fs.writeFileSync(filePath, buffer);
            
            return {
                filename: filename,
                path: filePath
            };
        }));

        // Create email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL, // Use fixed receiver email from environment variables
            subject: 'New CloudCopy Documents Received',
            html: `
                <h2>New Documents Received</h2>
                <p>New documents have been uploaded with the following settings:</p>
                <ul>
                    <li>Copies: ${printSettings.copies}</li>
                    <li>Color Mode: ${printSettings.colorMode}</li>
                    <li>Orientation: ${printSettings.orientation}</li>
                </ul>
                <p>You can find the documents attached to this email.</p>
            `,
            attachments: attachments
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Clean up temporary files
        attachments.forEach(attachment => {
            fs.unlinkSync(attachment.path);
        });

        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}

module.exports = {
    sendEmailWithAttachments,
    upload
}; 