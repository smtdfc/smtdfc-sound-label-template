reuqire("dotenv").config()
const fastify = require("fastify");


const app = fastify();

app.register(require("@fastify/cors"), {
  origin: (origin, cb) => cb(null, true),
  credentials: true,
});

app.register(require("@fastify/formbody"));
app.register(require("@fastify/multipart"));

app.register(require("@fastify/view"), {
  engine: { ejs: require("ejs") },
  root: path.join(__dirname, "../public/views"),
});

app.register(require("@fastify/static"), {
  root: path.join(__dirname, "../public/assets"),
  prefix: "/public/assets",
  decorateReply: false,
});

app.register(require("@fastify/static"), {
  root: path.join(__dirname, "../public/bundles"),
  prefix: "/public/bundles",
  decorateReply: false,
});

app.register(require("@fastify/cookie"), {
  secret: process.env.COOKIE_SECRET,
  parseOptions: {},
});

app.listen({ port: ServerConfiguration.SERVER_PORT });
