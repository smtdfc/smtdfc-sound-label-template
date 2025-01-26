const UploadController = require("../controllers/upload.controller.js")
const authHook = require("../hooks/index.js")

module.exports = function(fastify) {
  fastify.post("/api/v1/upload/avatar", authHook(), UploadController.uploadAvatar)
}