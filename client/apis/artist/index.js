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

  async create(name = "", streams = {}) {
    let { data } = this.axiosInstance.post("/api/v1/artist/create", {
      name,
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