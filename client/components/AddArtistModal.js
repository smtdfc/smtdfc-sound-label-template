export const AddArtistModal = Turtle.createComponent({
  states: {
    isDisplay: false,
    artistName: "",
    legalName:"",
    avatar: "",
    streams: {
      spotify: "",
      appleMusic: "",
      soundCloud: ""
    }
  },

  onRender() {
    let [forwardRef] = this.props
    forwardRef.show = () => {
      new TurtleUI.TurtleUIModal(this.refs.modal).open()
    }
  },

  onUploadBtnClick() {
    this.refs.avatarInput.click()
  },

  onAvatarSelect(event) {
    let file = event.target.files[0]
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgElement = this.refs.imgDisplay
        imgElement.src = e.target.result;
        imgElement.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  },

  async onAddBtnClick() {
    let [forwardRef] = this.props
    let info = await this.app.api.client.artist.create(
      this.states.artistName,
      this.states.legalName,
      {
        spotify: this.states.spotify,
        appleMusic: this.states.appleMusic,
        soundCloud: this.states.soundCloud
      },
      this.refs.avatarInput.files[0]
    )

    forwardRef.onAdded?.(info)
    new TurtleUI.TurtleUIModal(this.refs.modal).close()
  },

  template() {
    return this.html`
      <div class="modal" t-ref="modal" id="${this.id("modal")}" style="z-index:20000!important;">
        <div class="modal-contents">
          <div class="modal-header">
            <h3 class="modal-title">Add Artist</h3>
            <button class="btn-icon material-symbols-outlined notranslate" data-taction="modal:toggle:#${this.id("modal")}" >close</button>
          </div>
          
          <div class="modal-body p-3">
              <div class="d-flex align-items-center justify-content-center">
                <div class="avatar-container">
                  <img t-ref="imgDisplay" class="avatar avatar-lg" src="/public/assets/images/722264.jpg" alt="Avatar" />
                  <span class="avatar-hover-contents material-symbols-outlined notranslate" t-events="click:onUploadBtnClick" >upload</span>
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
              <br/>
              <div class="d-flex">
                <button t-events="click:onAddBtnClick" class="ml-auto btn btn-primary " style="width:85px">Add</button>
              </div>
          </div>
        </div>
      </div>
    `
  }
})