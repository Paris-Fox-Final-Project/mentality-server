if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = {
  avatarStorage: async (req, res, next) => {
    if (!req.file) {
      next();
      return;
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: req.file.buffer,
      Key: `${new Date()} ${req.file.originalname}`,
    };

    s3.upload(params, (error, data) => {
      if (error) {
        next(error);
      }

      if (data) {
        const url = data.Location;
        req.avatarUrl = url;
        next();
      }
    });
  },
};
