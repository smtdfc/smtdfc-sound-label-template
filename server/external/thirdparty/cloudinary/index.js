const cloudinary = require('./connect.js');

module.exports.uploadImage = async function(file, folders = "unknown") {
  try {
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: `images/${folders}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'webp' },
      ],
    });
    return {
      url: uploadResult.secure_url,
      id: uploadResult.public_id
    }

  } catch (error) {
    throw {
      name: "StoreError",
      message: "Cannot upload image !"
    }
  }

}