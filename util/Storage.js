const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Load environment variables

// Use environment variable or default to a specific path
const customImagePath = process.env.IMAGE_STORAGE_PATH || path.join(__dirname, 'uploads'); 

// Ensure directory exists or create it
if (!fs.existsSync(customImagePath)) {
    fs.mkdirSync(customImagePath, { recursive: true });
}

// Configure Multer for image uploads with custom path
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, customImagePath); // Set your custom path here
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName); // Create unique file name
    }
});

// File filter to only allow image uploads
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|gif/;
    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedExtensions.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure the upload middleware with file size limit and filter
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Export the upload middleware
module.exports = upload;
