const Configuration= require("../../../configs/cloudinary.js")
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name:Configuration.CLOUD_NAME, 
  api_key: Configuration.API_KEY,
  api_secret: Configuration.API_SECRET,
});

module.exports = cloudinary;