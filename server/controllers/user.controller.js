const UserService = require("../services/user")
const { responseSuccess, responseError } = require("../utils/response.js")

class UserController {
  static async updateName(req, res) {
    let { name } = req.body
    try {
      let results = await UserService.updateName(
        req.user.userID,
        name
      )

      return responseSuccess(req, res,
      {
        success: true,
      })
    } catch (err) {
      console.log(err)
      return responseError(req, res, err)
    }
  }

  static async updateEmail(req, res) {
    let { email } = req.body
    try {
      let results = await UserService.updateEmail(
        req.user.userID,
        email
      )

      return responseSuccess(req, res,
      {
        success: true,
      })
    } catch (err) {
      console.log(err)
      return responseError(req, res, err)
    }
  }

  static async updateUsername(req, res) {
    let { username } = req.body
    try {
      let results = await UserService.updateName(
        req.user.userID,
        username
      )

      return responseSuccess(req, res,
      {
        success: true,
      })
    } catch (err) {
      console.log(err)
      return responseError(req, res, err)
    }
  }

  static async updateAvatar(req, res) {
    let { file } = req.body
    try {
      let results = await UserService.updateAvatar(
        req.user.userID,
        file
      )

      return responseSuccess(req, res,
      {
        success: true,
        avatar:results.url
      })
    } catch (err) {
      console.log(err)
      return responseError(req, res, err)
    }
  }

}

module.exports = UserController