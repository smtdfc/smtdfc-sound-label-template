module.exports.generateID = function(prefix=""){
  return `${prefix}${(Math.floor(Math.random()*1990)*Date.now()).toString(32)}`
}