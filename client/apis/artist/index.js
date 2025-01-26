export class APIClientArtistManage {
  constructor(app, configs = {}) {
    this.app = app;
    this.configs = configs;
    this.axiosInstance = app.axiosInstance;
    app.artist = this;
    
  }
  
  async list(){
    this.axiosInstance.post("/api/v1/artist/list",{},{
      withCredentials: true,
    })
  }

  static init(app, configs) {
    return new APIClientArtistManage(app, configs);
  }
}