module.exports = function(fastify){
  fastify.get("/",function(req,res){
    return res.view("index.html")
  })
}