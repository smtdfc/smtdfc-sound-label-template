const { generateID } = require("../../utils/id.js");


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
  const info = await globalThis.Models.Artists.create({
    artistID:generateID(),
    name,
    legalName,
    avatar,
    streams:JSON.stringify(streams),
    createBy
  });
  
  return info
}

