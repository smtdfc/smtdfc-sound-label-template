const cloudinary = require("../../external/thirdparty/cloudinary")
const fs = require('fs');
const path = require('path');


function solveAvatarPathFile(fileName) {
  const filePath = path.join(__dirname, '../../../.data/uploads/avatar', fileName);

  const uploadsDir = path.join(__dirname, '../../../.data/uploads/avatar');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  return filePath
}


async function updateName(userID, name) {
  const result = await globalThis.Models.UserAccounts.update({ name }, { where: { userID } });
  return result;
}

async function updateUsername(userID, username) {
  const existingUser = await globalThis.Models.UserAccounts.findOne({
    where: { username },
  });

  if (existingUser) {
    throw {
      name: "QueryError",
      message: "This username is already taken! Please use another one. "
    }
  }

  const result = await globalThis.Models.UserAccounts.update({ username }, { where: { userID } });

  return result;
}

async function updateEmail(userID, email) {
  const existingUser = await globalThis.Models.UserAccounts.findOne({
    where: { email },
  });

  if (existingUser) {
    throw {
      name: "QueryError",
      message: "This email is already in use! Please use another email "
    };
  }

  const result = await globalThis.Models.UserAccounts.update({ email }, { where: { userID } });

  return result;
}

async function updateAvatar(userID, avatarPath) {
  let fullPath = solveAvatarPathFile(avatarPath)
  let result = await cloudinary.uploadImage(fullPath)
  await globalThis.Models.UserAccounts.update({ avatar:result.url }, { where: { userID } });

  return result
}
module.exports = {
  updateName,
  updateUsername,
  updateEmail,
  updateAvatar
};