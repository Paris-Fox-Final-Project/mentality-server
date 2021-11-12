const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mimetype = file.mimetype;
  if (
    mimetype === "image/png" ||
    mimetype === "image/jpeg" ||
    mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid File Type"));
  }
};

module.exports = {
  uploadAvatar: multer({ storage: storage, fileFilter }),
};
