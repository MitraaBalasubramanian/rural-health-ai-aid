const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

// Configure multer for memory storage (we'll process before saving)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB default
  }
});

// Middleware to process and save image
const processImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  try {
    // Generate unique filename
    const filename = `${uuidv4()}.jpg`;
    const filepath = path.join(uploadDir, filename);

    // Process image with Sharp
    await sharp(req.file.buffer)
      .resize(1024, 1024, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85,
        progressive: true 
      })
      .toFile(filepath);

    // Add file info to request
    req.processedFile = {
      filename: filename,
      path: filepath,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: 'image/jpeg'
    };

    next();
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
};

// Cleanup middleware to remove uploaded files on error
const cleanupOnError = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // If there's an error and we have a processed file, clean it up
    if (res.statusCode >= 400 && req.processedFile) {
      fs.unlink(req.processedFile.path).catch(console.error);
    }
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = {
  upload: upload.single('image'),
  processImage,
  cleanupOnError
};