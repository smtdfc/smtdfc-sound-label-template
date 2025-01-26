const AuthController = require("../controllers/auth.controller.js")
const authHook = require("../hooks/index.js")

module.exports = function(fastify) {
  fastify.post("/api/v1/auth/register",AuthController.register)
  fastify.post("/api/v1/auth/login",AuthController.login)
  fastify.post("/api/v1/auth/refresh",AuthController.refresh)
  fastify.post("/api/v1/auth/logout",AuthController.logout)
  fastify.post("/api/v1/auth/check",AuthController.check)
  fastify.post("/api/v1/auth/info",authHook(),AuthController.info)
  fastify.post("/api/v1/auth/changePassword", authHook(), AuthController.changePassword)
}