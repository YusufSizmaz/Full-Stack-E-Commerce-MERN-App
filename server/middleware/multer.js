import multer from "multer";
import { AppError } from "./errorHandler.js";

const storage = multer.memoryStorage();

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`Invalid file type. Only ${allowedMimes.join(', ')} are allowed`, 400), false);
  }
};

// Multer configuration with limits and validation
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 10 // Maximum 10 files at once
  },
  fileFilter: fileFilter
});

// Error handler for multer errors
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'File too large. Maximum size is 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Too many files. Maximum is 10 files'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Unexpected field in file upload'
      });
    }
  }
  next(err);
};

export default upload;
