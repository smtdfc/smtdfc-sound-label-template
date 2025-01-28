import { Cofigurations } from '../configs/app.js';


export const Navbar = Turtle.createComponent({
  states: {
    isAuthed: false,
    userAvatar: "",
  },

  onInit: function() {
    this.auth = this.app.api.client.auth
    this.userInfo = this.app.auth.user._info
    this.app.api.client.eventEmitter.on("auth:change", (data) => this.onAuthStateChange(data))
  },

  onAuthStateChange: function(user) {
    this.states.userAvatar = user._info.avatar
    this.states.isAuthed = user._info.userID ? true : false
  },

  template: function() {
    return this.html`
      <nav class="navbar backdrop-blur fade-in-down bg-transparent " id="main-navbar" >
        <div class="navbar-header">
          <button t-show="isAuthed" data-taction="sidebar:toggle:#main-sidebar" class="navbar-toggle-btn btn-icon material-symbols-outlined notranslate">menu</button>
          <h3 class="navbar-title">${Cofigurations.APP_NAME}</h3>
        </div>
        <div class="navbar-items">
          <button class=" btn-icon material-symbols-outlined notranslate">notifications</button>
          <img t-binds="src:userAvatar"  t-show="isAuthed" data-taction="offcanvas:toggle:#main-offcanvas" class="fade avatar avatar-xs" src="/static/images/avatar/avatar.jpg"/>
        </div>
      </nav>
    `
  },
})