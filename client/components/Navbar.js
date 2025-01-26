import { Cofigurations } from '../configs/app.js';

export const Navbar = Turtle.createComponent({
  states: {
    isAuthed: true,
    userAvatar:"",
  },
  
  onInit: function() {
      },

  template: function() {
    return this.html`
      <nav class="navbar shadow backdrop-blur fade-in-down bg-transparent " id="navbar" >
        <div class="navbar-header">
          <button t-show="isAuthed" class="navbar-toggle-btn btn-icon material-symbols-outlined" data-taction="sidebar:toggle:#main-sidebar">menu</button>
          <h3 class="navbar-title">${Cofigurations.APP_NAME}</h3>
        </div>
        <div class="navbar-items">
          <button class=" btn-icon material-symbols-outlined">notifications</button>
          <img t-binds="src:userAvatar"  t-show="isAuthed" data-taction="offcanvas:toggle:#main-offcanvas" class="fade avatar avatar-sm" src="/static/images/avatar/avatar.jpg"/>
        </div>
      </nav>
    `
  },
})