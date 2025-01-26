import { APIClientAppEventEmitter } from './events.js';
import { APIClientAuth } from './auth/index.js';
import {APIClientArtistManage} from './artist/index.js';
import { Cofigurations } from '../configs/app.js';

export function initClientAPI(app) {
  app.useModule(APIClientTurtleAppModule, {
    host: Cofigurations.BACKEND_HOST
  })
  if (Cofigurations.AUTH_REQUIRE) {
    app.api.client.addModule(APIClientAuth)
    app.api.client.addModule(APIClientArtistManage)
    app.auth = app.api.client.auth
    app.authenticated = function() {
      return new Promise((resolve, reject) => {
        if (!app.auth.user._info.userID) {
          document.getElementById("overlay").classList.add("active")
          app.api.client.auth.info()
            .then(() => {
              resolve(app.auth.user._info.userID)
            })
            .catch((err) => {
              resolve(false)
            })
            .finally(() => {
              document.getElementById("overlay").classList.remove("active")
            })
        } else {
          resolve(app.auth.user._info.userID)
        }
      })

    }
  }
}

export class APIInitiator {
  constructor(configs) {
    this.configs = configs
    this.axiosInstance = axios.create({
      baseURL: configs.host
    });
    this.modules = []
    this.eventEmitter = new APIClientAppEventEmitter()
  }

  addModule(module) {
    this.modules.push(module)
    module.init(this)
  }
}

export class APIClientTurtleAppModule {
  constructor(app, configs) {
    this.app = app
    this.app.api = this
    this.client = new APIInitiator(configs)
  }

  static init(app, configs) {
    return new APIClientTurtleAppModule(app, configs)
  }

}