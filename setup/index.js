const path = require("path")
const rollup = require('rollup')
const terser = require("@rollup/plugin-terser")
const LogHelper = require("./helper/logger")

const ClientBuildLogger = new LogHelper("client_web_build")
const Configuration = {
  type: "app",
  buildClientWeb: true,
  runServer: true
}


async function buildClientWeb() {
  ClientBuildLogger.info("Initializing .....")

  const bundle = await rollup.rollup({
    input: path.resolve(__dirname,'../client/app.js'),
    plugins: [
      terser({
        compress: {
          drop_console: true,
          passes: 3,
          toplevel: true,
        },
        output: {
          comments: false,
        },
     }),
    ]
  });
  ClientBuildLogger.info("Bundling .....")

  await bundle.write({
    dir: path.resolve(__dirname,'../public/bundles'),
    format: "es",
    entryFileNames: "bundle.min.js",
    chunkFileNames:"[name].[hash].min.js"
  });

  ClientBuildLogger.success("Completed !")
  ClientBuildLogger.info("Client web ready !")
}

function start() {
  if (Configuration.buildClientWeb && Configuration.type == "app") buildClientWeb()
  if (Configuration.runServer && Configuration.type != "web") require("../server")
}

start()