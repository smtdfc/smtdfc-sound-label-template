const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { DataTypes, Op } = require("sequelize");
const { generateID } = require("../../utils/id.js");
const {
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION
} = require("../../configs/server.js");

class AuthService {
  static async register(userData) {
    const { name, email, username, password } = userData;
    const existingUser = await globalThis.Models.UserAccounts.findOne({
      where: { email }
    });

    if (existingUser) {
      throw {
        name: "RegistrationError",
        message: "Email has already been registered!"
      };
    }

    const userID = generateID("user_");
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await globalThis.Models.UserAccounts.create({ userID, name, email, username, avatar: "" });

    await globalThis.Models.UserAuth.create({
      userID: user.userID,
      authType: 'password',
      authKey: hashedPassword,
    });

    return user;
  }

  static async changePassword(userID, oldPassword, newPassword) {
    if (!oldPassword || !newPassword) throw {
      name: "ActionError",
      message: "Unable to change password !"
    };
    const userAuthInfo = await globalThis.Models.UserAuth.findOne({
      where: { authType: 'password' },
      include: [{
        model: globalThis.Models.UserAccounts,
        where: { userID },
        required: true,
        as: "userInfo",
      }],
    });

    if (!userAuthInfo) {
      throw {
        name: "ActionError",
        message: "Unable to change password !"
      };
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, userAuthInfo.authKey);
    if (!isPasswordValid) {
      throw {
        name: "ActionError",
        message: "Old password is incorrect !"
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await globalThis.Models.UserAuth.update({ authKey: hashedPassword }, { where: { userID } });

    return { success: true }
  }

  static async login(email, password, metadata = {}) {
    const userAuthInfo = await globalThis.Models.UserAuth.findOne({
      where: { authType: 'password' },
      include: [{
        model: globalThis.Models.UserAccounts,
        where: { email },
        required: true,
        as: "userInfo",
      }],
    });

    if (!userAuthInfo) {
      throw {
        name: "AuthenticationError",
        message: "Incorrect email or password!"
      };
    }

    const isPasswordValid = await bcrypt.compare(password, userAuthInfo.authKey);
    if (!isPasswordValid) {
      throw {
        name: "AuthenticationError",
        message: "Incorrect email or password!"
      };
    }

    const user = userAuthInfo.userInfo;
    const sid = generateID("sid")
    const accessToken = jwt.sign({ userID: user.userID }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });

    const refreshToken = jwt.sign({ userID: user.userID, sid }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });
    let session = await globalThis.Models.Session.create({
      userID: user.userID,
      token: refreshToken,
      sid,
      isSso: false,
    });
    this.logLoginHistory(user.userID, null, session.id, sid, metadata.ip, { client: metadata.client })

    return {
      info: user,
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      return decoded;
    } catch (error) {
      throw {
        name: "TokenError",
        message: "Invalid token!"
      };
    }
  }

  static async verifyRefreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      return decoded;
    } catch (error) {
      throw {
        name: "TokenError",
        message: "Invalid refresh token!"
      };
    }
  }

  static async getUserInfo(userID) {
    const user = await globalThis.Models.UserAccounts.findOne({ where: { userID }, raw: true });
    if (!user) {
      throw {
        name: "NotFoundError",
        message: "User does not exist!"
      };
    }

    return user;
  }

  static async createSession(userID, token, isSso = false, appID = null, sid = null) {
    const session = await globalThis.Models.Session.create({
      userID,
      token,
      sid: sid ? sid : `sid-${Date.now()}`,
      isSso,
      appID
    });

    return session;
  }

  static async logLoginHistory(userID, appID, rid, sid, ip, metadata = {}) {
    await globalThis.Models.LoginHistory.create({
      userID,
      rid,
      appID,
      sid,
      ip,
      metadata,
    });
  }

  static async getSessionInfo(token) {
    let info = await globalThis.Models.Session.findOne({
      where: {
        token
      }
    })
    return info
  }

  static async checkSession(token) {
    let info = await globalThis.Models.Session.findOne({
      where: {
        token
      },
      include: [{
        model: globalThis.Models.UserAccounts,
        required: true,
        as: "userInfo",
      }]
    })
    if (!info) {
      throw {
        name: "AuthenticationError",
        message: "Session expired !"
      };
    }

    return info.userInfo
  }

  static async logout(refreshToken) {
    const decoded = await AuthService.verifyRefreshToken(refreshToken);
    const session = await globalThis.Models.Session.destroy({
      where: { sid: decoded.sid }
    });

    return {}
  }

  static async refreshToken(refreshToken) {
    const decoded = await AuthService.verifyRefreshToken(refreshToken);

    let info = await globalThis.Models.Session.findOne({
      where: {
        token: refreshToken
      },
      include: [{
        model: globalThis.Models.UserAccounts,
        required: true,
        as: "userInfo",
      }]
    })
    if (!info) {
      throw {
        name: "AuthenticationError",
        message: "Session expired !"
      };
    }

    if (!info.userInfo) {
      throw {
        name: "NotFoundError",
        message: "User does not exist!"
      };
    }

    const newAccessToken = jwt.sign({ userID: info.userInfo.userID }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });

    return { accessToken: newAccessToken };
  }

  static async generateSSOLoginCode(userID, sid, appID, secretKey) {
    const code = jwt.sign({ userID: userID, sid, appID }, secretKey, {
      expiresIn: "6m",
    });

    return code
  }

  static async verifySSOLoginCode(code, secretKey) {
    try {
      const decoded = jwt.verify(code, secretKey);
      return decoded;
    } catch (error) {
      throw {
        name: "ActionError",
        message: "Invalid login code!"
      };
    }
  }


  static async createSSOSession(userID, sid, appID) {
    const accessToken = jwt.sign({ userID: userID }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });

    const refreshToken = jwt.sign({ userID: userID, sid }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });
    let session = await this.createSession(userID, refreshToken, true, appID, sid)
    await this.logLoginHistory(userID, appID,session.id, sid, "::0" , { appID })
    return {
      tokens: {
        accessToken,
        refreshToken
      }
    }
  }

  static async getSSOAppInfo(appID) {
    let info = await globalThis.Models.SSOApp.findOne({
      where: {
        appID
      }
    })
    return info
  }
}

module.exports = AuthService;