const AuthService = require("../services/auth")
const { responseSuccess, responseError } = require("../utils/response.js")

class AuthController {
  static async register(req, res) {
    let { email, password, username, name } = req.body
    try {
      let userInfo = await AuthService.register({
        email,
        password,
        username,
        name
      })

      return responseSuccess(req, res, userInfo)
    } catch (err) {
      return responseError(req, res, err)
    }
  }

  static async login(req, res) {
    let { email, password, } = req.body
    try {
      let results = await AuthService.login(
        email,
        password,
        {
          ip: req.ip,
          client: req.body.client ?? {}
        }
      )

      return responseSuccess(req, res,
      {
        info: results.info,
      },
      {
        tokens: results.tokens
      })
    } catch (err) {
      console.log(err)
      return responseError(req, res, err)
    }
  }

  static async info(req, res) {
    let { userID } = req.user
    try {
      let results = await AuthService.getUserInfo(userID)
      return responseSuccess(req, res, {
        info: results,
      })
    } catch (err) {
      return responseError(req, res, err, 403)
    }
  }

  static async changePassword(req, res) {
    let { userID } = req.user
    let { oldPassword, newPassword } = req.body
    try {
      let results = await AuthService.changePassword(userID, oldPassword, newPassword)
      return responseSuccess(req, res, results)
    } catch (err) {
      return responseError(req, res, err, err.name == "ActionError" ? 400 : 403)
    }
  }


  static async check(req, res) {
    let token = null
    if (req.body.token) token = req.body.token
    else token = req.cookies.rt
    try {

      let results = await AuthService.checkSession(token)
      return responseSuccess(req, res, {
        info: results,
      })
    } catch (err) {
      return responseError(req, res, err, 403)
    }
  }

  static async refresh(req, res) {
    let token = null
    if (req.body.token) token = req.body.token
    else token = req.cookies.rt
    try {
      let tokens = await AuthService.refreshToken(token)
      return responseSuccess(req, res, {}, { tokens })
    } catch (err) {
      return responseError(req, res, err, 403)
    }
  }

  static async logout(req, res) {
    let token = null
    if (req.body.token) token = req.body.token
    else token = req.cookies.rt
    try {
      await AuthService.logout(token)
      res.clearCookie("at", {
        path: "/"
      })

      res.clearCookie("rt", {
        path: "/"
      })
      return responseSuccess(req, res, {}, {
        tokens: {
          accessToken: "",
          refreshToken: ""
        }
      })
    } catch (err) {
      return responseError(req, res, err)
    }
  }
}

module.exports = AuthController