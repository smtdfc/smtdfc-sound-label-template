const { generateID } = require("../../utils/id.js");

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


module.exports.list =  async function(userID){
  const list = await globalThis.Models.Artists.findAll({
    where:{
      createBy:userID
    },
    raw:true,
    attributes:["artistID","name","streams","status","avatar"]
  });
  
  return list
}

module.exports.create =  async function(name, legalName,streams={},avatar,createBy=""){
  let fullPath = solveAvatarPathFile(avatar)
  let avatarInfo = await cloudinary.uploadImage(fullPath)

  const info = await globalThis.Models.Artists.create({
    artistID:generateID(),
    name,
    legalName,
    avatar:avatarInfo.url,
    streams:JSON.stringify(streams),
    createBy
  });
  
  return info
}

