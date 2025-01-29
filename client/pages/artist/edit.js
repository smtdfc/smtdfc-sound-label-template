
export const Page = Turtle.createComponent({
  states: {
    isLoading: true,
  },

  async onInit() {
    if (!await this.app.authenticated()) {
      this.app.router.redirect("/login", true);
      return false;
    }
    this.userInfo = this.app.auth.user._info;
  },

  onRender() {
     this.app.api.client.artist.info()
      .then((info) => {
      })
  },


  template() {
    return this.html`
      <div class="root fade-in " style="min-height:80vh;" ref="container">
        <div class="d-flex align-items-center ">
          <a href="#!/artist/manage" class="material-symbols-outlined notranslate btn-icon">arrow_back</a>
          <div class="ml-3 d-flex flex-col">
            <h3 class="m-0">Edit Artist Info</h3>
          </div>
        </div>
        <div class="mt-5" t-hide="isLoading" >
          <div class="d-flex align-items-center justify-content-center">
            <div class="avatar-container">
              <img t-ref="imgDisplay" class="avatar avatar-lg" src="/public/assets/images/722264.jpg" alt="Avatar" />
              <span class="avatar-hover-contents material-symbols-outlined notranslate" t-events="click:onUploadBtnClick">upload</span>
            </div>
          </div>
          <input t-ref="avatarInput" t-events="change:onAvatarSelect" type="file" class=" d-none" />
          <div class="form-group">
            <label class="form-label">Artist Alias:</label>
            <input t-model="artistName" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Legal name:</label>
            <input t-model="legalName" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Spotify Link:</label>
            <input t-model="spotify" type="text" class="form-input " />
          </div>
          <div class="form-group">
            <label class="form-label">Apple Music Link:</label>
            <input t-model="appleMusic" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">SoundCloud Link:</label>
            <input t-model="soundCloud" type="text" class="form-input" />
          </div>
          <br />
          <div class="d-flex">
            <button t-events="click:onAddBtnClick" class="ml-auto btn btn-primary " style="width:85px">Add</button>
          </div>
        </div>
        <div class="mt-7 circle-loader" t-show="isLoading" />
      </div>
    `;
  },
});