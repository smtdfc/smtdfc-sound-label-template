const { Sequelize } = require('sequelize');
const LogHelper = require("../../helper/logger")
const DBConfiguration = require("../../configs/db.js")

const Logger = new LogHelper("Database")
module.exports = function(app) {
  if (DBConfiguration.USING_DB) {
    Logger.info("Initializing connection ...")

    for (let name in DBConfiguration.LIST) {
      let configs = DBConfiguration.LIST[name]
      const connection = new Sequelize(configs.url,{
        logging:false
      });
      globalThis._db[name] = connection
    }

    Logger.success("Database connected successfully  ")
  } else {
    Logger.info("No Database connection ...")
  }
}