const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

exports.fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './src/images');
  },
  filename: (req, file, callback) => {
    callback(null, uuidv4() + '-' + file.originalname);
  },
});

exports.fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
