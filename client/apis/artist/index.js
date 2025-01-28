export class APIClientArtistManage {
  constructor(app, configs = {}) {
    this.app = app;
    this.configs = configs;
    this.axiosInstance = app.axiosInstance;
    app.artist = this;

  }

  async list() {
    let { data } = await this.axiosInstance.post("/api/v1/artist/list", {}, {
      withCredentials: true,
    })

    return data.results.list
  }

  uploadAvatar(file, onProcess = () => {}) {
    return new Promise(async (resolve, reject) => {
      const sizeInMB = file.size / (1025 * 1024);
      const type = file.type;
      const validMimeTypes = [
         "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/svg+xml", "image/tiff", "image/x-icon", "image/avif"
      ];

      if (sizeInMB > 5) throw { name: "UploadError", message: "File size is too large! (Max: 5MB)" };
      if (!validMimeTypes.includes(type)) throw { name: "UploadError", message: "Unsupported file format!" };
      let formData = new FormData();
      formData.append("file", file);
      const response = await this.axiosInstance.post("/api/v1/upload/avatar", formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProcess(percentCompleted);
        },
      });
      resolve(response.data.results.fileName)
    })
  }


  async create(name = "",legalName="",streams = {}, avatarFile = "") {
    let avatar = await this.uploadAvatar(avatarFile)
    let { data } = await this.axiosInstance.post("/api/v1/artist/create", {
      name,
      legalName,
      avatar,
      streams
    }, {
      withCredentials: true,
    })

    return data.results.info
  }

  static init(app, configs) {
    return new APIClientArtistManage(app, configs);
  }
}