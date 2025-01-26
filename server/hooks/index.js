const AuthService = require("../services/auth");
const { responseError } = require("../utils/response.js");

module.exports = function(raiseErr=true) {
  return {
    preHandler: async (req, res) => {
      req.user = null
      try {
        const token =
          req.headers.authorization?.split(" ")[1] ||
          req.cookies?.at;

        if (!token && raiseErr) {
          return responseError(req, res, {
            name: "AuthenticationError",
            message: "Authentication Required!",
          },403);
        }

        const info = await AuthService.verifyToken(token);
        if (!info?.userID && raiseErr) {
          return responseError(req, res, {
            name: "AuthenticationError",
            message: "Authentication Required!",
          },403);
        }

        req.user = info;
      } catch (err) {
        if(raiseErr) return responseError(req, res, err,403);
      }
    },
  };
};