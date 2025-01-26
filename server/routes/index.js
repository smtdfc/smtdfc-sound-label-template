const routes = [
  require("./auth.routes.js"),
  require("./view.routes.js"),
  require("./user.routes.js"),
  require("./upload.routes.js"),
]

module.exports = function(fastify) {
  for (let route of routes) {
    route(fastify)
  }
}