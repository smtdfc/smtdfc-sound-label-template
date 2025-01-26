export const Container = Turtle.createComponent({
  states:{
    isAuthed:false
  },
  template(){
    return this.html`
    <div class="sidebar-container">
      <div class="sidebar" t-show="true" id="main-sidebar" >
        <div class="sidebar-header">
          <button class="sidebar-btn close-btn material-symbols-outlined btn-icon" data-taction="sidebar:toggle:#main-sidebar" >close</button>
        </div>
        <div class="sidebar-body">
          <ul class="sidebar-menu">
            <li><a href="#!/home"><i class="material-symbols-outlined">home</i>Home</a></li>
            <li><a href="#!/home"><i class="material-symbols-outlined">music_note</i>Tracks</a></li>
            <li><a href="#!/home"><i class="material-symbols-outlined">group</i>Artists</a></li>
            <li><a href="#!/home"><i class="material-symbols-outlined">bookmark_flag</i>Labels</a></li>
            <li><a href="#!/home"><i class="material-symbols-outlined">settings</i>Settings</a></li>
          </ul>
        </div>
      </div>
      <div class="contents px-3" id="contents" style="padding-top:5rem" >
        jsjskskzks
      </div>
    </div>
    `
  }
})