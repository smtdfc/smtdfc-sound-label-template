import { CookieHelper } from "../helpers/cookie.js";
import { getUserAgentInfo } from "../helpers/agent.js";

const validateParams = (params) => {
  const errors = [];
  if (params.email && !/\S+@\S+\.\S+/.test(params.email)) errors.push("Invalid email.");
  if (params.password && params.password.length < 6) errors.push("Password must be at least 6 characters.");
  if (params.username && params.username.trim() === '') errors.push("Username cannot be empty.");
  if (params.username && /[^a-zA-Z0-9_]/.test(params.username)) errors.push("Username can only contain letters, numbers, and underscores.");
  if (params.name && params.name.trim() === '') errors.push("Name cannot be empty.");

  if (errors.length) throw { name: 'ValidationError', message: errors.join(' ') };

  return true;
};

const extractResult = (response) => response.data.results;
const extractError = (response) => response.data.error;

class UserInfo {
  constructor(auth, info = {}) {
    this.app = auth.app;
    this.auth = auth;
    this._info = info;
  }

  async updateName(name) {
    const params = { name };
    validateParams(params);
    await this.auth._makeRequest("/api/v1/user/update/name", params, { withCredentials: true });
    this._info.name = name;
    this.app.eventEmitter.emit("auth:change", this);
  }

  async updateUsername(username) {
    const params = { username };
    validateParams(params);
    await this.auth._makeRequest("/api/v1/user/update/username", params, { withCredentials: true });
    this._info.username = username;
    this.app.eventEmitter.emit("auth:change", this);
  }

  async updateEmail(email) {
    const params = { email };
    validateParams(params);
    await this.auth._makeRequest("/api/v1/user/update/email", params, { withCredentials: true });
    this._info.email = email;
    this.app.eventEmitter.emit("auth:change", this);
  }

  async updatePassword(oldPassword, newPassword) {
    const params = { oldPassword, newPassword };
    validateParams(params);
    await this.auth._makeRequest("/api/v1/auth/changePassword", params, { withCredentials: true });
    return {};
  }

  async updateAvatar(file, onProcess = () => {}) {
    const sizeInMB = file.size / (1025 * 1024);
    const type = file.type;
    const validMimeTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/svg+xml", "image/tiff", "image/x-icon", "image/avif"
    ];

    if (sizeInMB > 5) throw { name: "UploadError", message: "File size is too large! (Max: 5MB)" };
    if (!validMimeTypes.includes(type)) throw { name: "UploadError", message: "Unsupported file format!" };

    const uploadResults = await this.auth._makeRequestUpload("/api/v1/upload/avatar", file, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProcess(percentCompleted);
      },
    });

    const response = await this.auth._makeRequest("/api/v1/user/update/avatar", { file: uploadResults.fileName }, { withCredentials: true });
    this._info.avatar = response.avatar;
    this.app.eventEmitter.emit("auth:change", this);
  }

  get info() {
    return this._info;
  }

  set info(data) {
    this._info = data;
    this.app.eventEmitter.emit("auth:change", this);
  }

  isEmpty() {
    return !!this._info.userID;
  }

  reset() {
    this.info = {};
  }
}

class APIClientAuth {
  constructor(app, configs = {}) {
    this.app = app;
    this.configs = configs;
    this.axiosInstance = app.axiosInstance;
    this.user = new UserInfo(this);

    app.auth = this;
    this._setupInterceptors();
  }

  static init(app, configs) {
    return new APIClientAuth(app, configs);
  }

  _setupInterceptors() {
    this.axiosInstance.interceptors.request.use(this._requestInterceptor, this._errorHandler);
    this.axiosInstance.interceptors.response.use(this._responseInterceptor.bind(this), this._responseErrorHandler.bind(this));
  }

  _requestInterceptor(config) {
    if (config.withCredentials) {
      const token = CookieHelper.getCookie("at_");
      if (token) {
        config.headers["x-api-auth"] = "used";
        config.headers.authorization = `Bearer ${token}`;
      }
    }
    return config;
  }

  _responseInterceptor(response) {
    const { accessToken, refreshToken } = response.data.auth?.tokens || {};
    if (accessToken) CookieHelper.setCookie("at_", accessToken, 1 / 96);
    if (refreshToken) CookieHelper.setCookie("rt_", refreshToken, 7);
    return response;
  }

  async _responseErrorHandler(error) {
    const ignoredPaths = [
      "/api/v1/auth/refresh",
      "/api/v1/auth/login",
      "/api/v1/auth/logout",
      "/api/v1/auth/register",
    ];
    const originalRequest = error.config;

    if (error.response?.status === 403 && !ignoredPaths.includes(originalRequest.url) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await this.refresh();
        return this.axiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }

  _errorHandler(error) {
    if (error.response) {
      const { name, message } = error.response.data;
      return Promise.reject({ name: name || 'UnknownError', message: message || 'An unknown error occurred.' });
    }
    return Promise.reject({ name: 'NetworkError', message: 'Network error occurred.' });
  }

  async _makeRequest(url, data = {}, options = {}) {
    try {
      const response = await this.axiosInstance.post(url, data, options);
      return extractResult(response);
    } catch (err) {
      throw extractError(err.response);
    }
  }

  async _makeRequestUpload(url, file, options = {}) {
    try {
      let formData = new FormData();
      formData.append("file", file);
      const response = await this.axiosInstance.post(url, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        ...options
      });
      return extractResult(response);
    } catch (err) {
      throw extractError(err.response);
    }
  }

  async register(name, email, username, password) {
    const params = { name, email, username, password };
    validateParams(params);
    return this._makeRequest("/api/v1/auth/register", params);
  }

  async login(email, password) {
    const params = { email, password, client: getUserAgentInfo() };
    const result = await this._makeRequest("/api/v1/auth/login", params);
    this.user.info = result.info || {};
    return this.user.info;
  }

  check() {
    const token = CookieHelper.getCookie("rt_");
    return this._makeRequest("/api/v1/auth/check", { token }, { withCredentials: true });
  }

  async info() {
    const result = await this._makeRequest("/api/v1/auth/info", {}, { withCredentials: true });
    if (!this.user.info?.userID) this.user.info = result.info;
    return result.info;
  }

  refresh() {
    const token = CookieHelper.getCookie("rt_");
    return this._makeRequest("/api/v1/auth/refresh", { token }, {
      withCredentials: true,
      headers: token ? { authorization: "Bearer null" } : {},
    });
  }

  async logout() {
    const token = CookieHelper.getCookie("rt_");
    await this._makeRequest("/api/v1/auth/logout", { token }, {
      withCredentials: true,
      headers: token ? { authorization: "Bearer null" } : {},
    });
    CookieHelper.eraseCookie("at_");
    CookieHelper.eraseCookie("rt_");
    this.user.reset();
  }
}

export { APIClientAuth, UserInfo };