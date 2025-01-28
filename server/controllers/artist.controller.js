const ArtistService = require("../services/artist")
const { responseSuccess, responseError } = require("../utils/response.js")

class ArtistController {
  static async list(req, res) {
    try {
      let results = await ArtistService.list(
        req.user.userID
      )

      return responseSuccess(req, res,
      {
        list: results,
      })
    } catch (err) {
      console.log(err)
      return responseError(req, res, err)
    }
  }

  static async create(req, res) {
    try {
      let { name, streams , avatar,legalName} = req.body
      let results = await ArtistService.create(
        name,
        legalName,
        streams,
        avatar,
        req.user.userID
      )

      return responseSuccess(req, res,
      {
        info: results,
      })
    } catch (err) {
      console.log(err)
      return responseError(req, res, err)
    }
  }

}

module.exports = ArtistController