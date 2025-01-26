const fs = require('fs');
const path = require('path');

module.exports.uploadAvatar = function(userID, file) {
  return new Promise((resolve, reject) => {
    const mimeType = file.mimetype;
    const allowedMimeTypes = ['image/jpeg', 'image/png'];

    if (!allowedMimeTypes.includes(mimeType)) {
      return reject({
        name: "UploadError",
        message: "Avatar must be an image file!"
      });
    }

    const fileName = `${userID}_${Date.now()}.jpg`;
    const fileData = file.file;
    const filePath = path.join(__dirname, '../../../.data/uploads/avatar', fileName);

    const uploadsDir = path.join(__dirname, '../../../.data/uploads/avatar');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(filePath);
    fileData.pipe(writeStream);

    writeStream.on('finish', () => {
      resolve({
        type: "avatar",
        fileName: fileName
      });
    });

    writeStream.on('error', (error) => {
      reject({
        name: "UploadError",
        message: "Unable to upload file!",
      });
    });
  });

}