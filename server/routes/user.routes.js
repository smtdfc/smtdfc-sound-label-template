const UserController = require("../controllers/user.controller.js")
const authHook = require("../hooks/index.js")

module.exports = function(fastify) {
  fastify.post("/api/v1/user/update/name", authHook(), UserController.updateName)
  fastify.post("/api/v1/user/update/email", authHook(), UserController.updateEmail)
  fastify.post("/api/v1/user/update/username", authHook(), UserController.updateUsername)
  fastify.post("/api/v1/user/update/avatar", authHook(), UserController.updateAvatar)
}