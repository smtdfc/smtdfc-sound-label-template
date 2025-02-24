import { EmptyMessage } from '../../components/EmptyMessage.js';
import { AddArtistModal } from '../../components/AddArtistModal.js';

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

  addRow(info) {
    this.refs.list.prepend(this.html`
      <li>
        <img class="avatar avatar-sm" src="${info.avatar??"/public/assets/images/722264.jpg"}"/>
        <span>
          <h5 class="m-0" >${info.name}</h5>
          <span class="sub-text">Artist/Producer</span>
        </span>
        <span class="ml-auto">
          <button data-id="${info.artistID}" t-events="click:onEditBtnClick" class="btn-icon material-symbols-outlined notranslate">edit</button>
          <button data-id="${info.artistID}" class="btn-icon material-symbols-outlined notranslate">delete</button>
        </span>
      </li>
    `)
  },

  onRender() {
    let { emptyMessage, addArtistModal } = this.refs
    addArtistModal.onAdded = (info) => this.addRow(info)
    emptyMessage.hide()
    this.app.api.client.artist.list()
      .then((list) => {
        if (list.length == 0) emptyMessage.show()
        else emptyMessage.hide()
        this.states.isLoading = false
        list.forEach((info) => this.addRow(info))
      })
  },

  onAddBtnClick() {
    this.refs.addArtistModal.show()
  },

  onEditBtnClick(e) {
    let artistID = e.target.dataset.id
    this.app.router.redirect(`/artist/${artistID}/edit`)
  },
  
  template() {
    return this.html`
      <div class="root fade-in " style="min-height:80vh;" ref="container">
        <div class="d-flex align-items-center ">
          <a href="#!/" class="material-symbols-outlined notranslate btn-icon">arrow_back</a>
          <div class="ml-3 d-flex flex-col">
            <h3 class="m-0">Artist Management</h3>
          </div>
          <button t-events="click:onAddBtnClick"  class="ml-auto btn-icon  material-symbols-outlined notranslate">add</button>
        </div>
        <div class="mt-5 ">
          <div class="container">
            <input class="form-input" style="padding:0.6rem; width:100%; " placeholder="Search artist..."/>
          </div>
          <ul class="list list-hover" t-ref="list" />
          <div class="circle-loader" t-show="isLoading" />
          <${EmptyMessage(
            this.forwardRef("emptyMessage"),
            "No artist here",
            true
          )}/>
          <${AddArtistModal(
            this.forwardRef("addArtistModal")
          )}/>
        </div>
      </div>
    `;
  },
});