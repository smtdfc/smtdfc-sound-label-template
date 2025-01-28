import {isMobile} from '../utils/devices.js';

export const Container = Turtle.createComponent({
  isSynchronous: true,
  states: {
    isAuthed: false
  },

  onInit: function() {
    this.auth = this.app.api.client.auth
    this.app.api.client.eventEmitter.on("auth:change", (data) => this.onAuthStateChange(data))
  },

  onAuthStateChange: function(user) {
    this.states.isAuthed = user._info.userID ? true : false
  },

  onRender() {
    if(isMobile()){
    const element = document.querySelector('#contents');
    function checkScroll() {
      const elementHeight = element.scrollHeight; 
      const scrollPosition = element.scrollTop; 
      const visibleHeight = element.clientHeight;
      const scrollPercentage = (scrollPosition / (elementHeight - visibleHeight)) * 100;
      if (scrollPercentage >= 40) {
        document.getElementById("main-navbar").classList.add("shadow")
      }else{
        document.getElementById("main-navbar").classList.remove("shadow")
      }
    }

    element.addEventListener('scroll', checkScroll);
    }
  },

  template() {
    return this.html`
    <div class="sidebar-container">
      <div class="sidebar" t-show="isAuthed" id="main-sidebar" >
        <div class="sidebar-header">
          <button class="sidebar-btn close-btn material-symbols-outlined notranslate btn-icon" data-taction="sidebar:toggle:#main-sidebar" >close</button>
        </div>
        <div class="sidebar-body">
          <ul class="sidebar-menu">
            <li><a href="#!/"><i class="material-symbols-outlined notranslate">home</i>Home</a></li>
            <li><a href="#!/home"><i class="material-symbols-outlined notranslate">music_note</i>Albums</a></li>
            <li><a href="#!/artist/manage"><i class="material-symbols-outlined notranslate">group</i>Artists</a></li>
            <li><a href="#!/home"><i class="material-symbols-outlined notranslate">bookmark_flag</i>Labels</a></li>
            <li><a href="#!/home"><i class="material-symbols-outlined notranslate">settings</i>Settings</a></li>
          </ul>
          <hr class="sidebar-separation"/>
          <div class="sub-text mt-7">
            <span>©2025 smtdfc sound (part of smtdfc ). All rights reserved.</span>
            <br/>
            <span>License code: (not registered)</span>
          </div>
        </div>
      </div>
      <span class="contents px-3" id="contents" style="padding-top:5rem;" ></span>
    </div>
    `
  }
})