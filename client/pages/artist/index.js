export const Page = Turtle.createComponent({

  async onCreate() {
    if (!this.app.authenticated()) {
      this.app.router.redirect("/login", true);
      return;
    }
    this.userInfo = this.app.auth.user._info;
  },

  onRender() {
    this.app.api.client.artist.list()
  },

  template() {
    return this.html`
      <div class="root fade-in " style="min-height:80vh;" ref="container">
        <div class="d-flex align-items-center ">
          <a href="#!/" class="material-symbols-outlined btn-icon">arrow_back</a>
          <div class="ml-3 d-flex flex-col">
            <h3 class="m-0">Artist Management</h3>
          </div>
          <button class="ml-auto btn-icon  material-symbols-outlined">add</button>

        </div>
        <div class="mt-5 ">
          <div class="container">
            <input class="form-input" style="padding:0.6rem; width:100%; " placeholder="Search artist..."/>
          </div>
        </div>
      </div>
    `;
  },
});