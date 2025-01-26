export async function list(userID){
  const list = await globalThis.Models.Artists.findAll({
    where:{
      createBy:userID
    },
    raw:true,
    attributes:["artistID","name","streams","status","avatar"]
  });
  
  return list
}