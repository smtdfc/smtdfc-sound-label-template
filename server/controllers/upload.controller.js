const UploadService = require("../services/upload")
const { responseSuccess, responseError } = require("../utils/response.js")

 class UploadController {
  static async uploadAvatar(req, res) {
    try {
      const file = await req.file();

      if (file) {
        let results = await UploadService.uploadAvatar(req.user.userID, file)
        return responseSuccess(req,res,results)
      } else {
        throw {
          name: "UploadError",
          message: "No file uploaded !"
        }
      }
    } catch (e) {
      return responseError(req, res, err,400)
    }

  }
}

module.exports = UploadController