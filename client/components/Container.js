export const Container = Turtle.createComponent({
  states:{
    isAuthed:false
  },
  
  onInit: function() {
    this.auth = this.app.api.client.auth
    this.app.api.client.eventEmitter.on("auth:change", (data) => this.onAuthStateChange(data))
  },

  onAuthStateChange: function(user) {
    this.states.isAuthed = user._info.userID ? true : false
  },
  template(){
    return this.html`
    <div class="sidebar-container">
      <div class="sidebar" t-show="isAuthed" id="main-sidebar" >
        <div class="sidebar-header">
          <button class="sidebar-btn close-btn material-symbols-outlined btn-icon" data-taction="sidebar:toggle:#main-sidebar" >close</button>
        </div>
        <div class="sidebar-body">
          <ul class="sidebar-menu">
            <li><a href="#!/"><i class="material-symbols-outlined">home</i>Home</a></li>
            <li><a href="#!/home"><i class="material-symbols-outlined">music_note</i>Albums</a></li>
            <li><a href="#!/home"><i class="material-symbols-outlined">group</i>Artists</a></li>
            <li><a href="#!/home"><i class="material-symbols-outlined">bookmark_flag</i>Labels</a></li>
            <li><a href="#!/home"><i class="material-symbols-outlined">settings</i>Settings</a></li>
          </ul>
          <hr class="sidebar-separation"/>
          <div class="sub-text mt-7">
            <span>©2025 smtdfc sound (part of smtdfc ). All rights reserved.</span>
            <br/>
            <span>License code: (not registered)</span>
          </div>
        </div>
      </div>
      <span class="contents px-3" id="contents" style="padding-top:5rem" ></span>
    </div>
    `
  }
})