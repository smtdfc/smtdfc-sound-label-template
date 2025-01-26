const ArtistController = require("../controllers/artist.controller.js")
const authHook = require("../hooks/index.js")

module.exports = function(fastify) {
  fastify.post("/api/v1/artist/list",authHook(), ArtistController.list)
  fastify.post("/api/v1/artist/create",authHook(), ArtistController.create)

}