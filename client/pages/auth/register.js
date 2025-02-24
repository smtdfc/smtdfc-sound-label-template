export const Page =  Turtle.createComponent({
  onInit() {
//   console.log(q)
    this.auth = this.app.auth
  },

  onRegBtnClick(e) {
    this.states.alertMessage = ""
    e.target.disabled = true
    e.preventDefault()
    this.auth.register(
        this.states.nameInput,
        this.states.emailInput,
        this.states.usernameInput,
        this.states.passwordInput,
     )
      .then((user) => {
        this.app.router.redirect("/login", true)
      })
      .catch((err) => {
        this.states.alertMessage = err.message
      })
      .finally(() => {
        e.target.disabled = false
      })
  },

  template() {
    return this.html`
      <div class="root fade container d-flex justify-content-center" style="padding-top:5rem; " ref="container">
        <div class="card p-4 m-0" style="width:350px;" >
          <h2 class="text-align-center" >Welcome to our service</h2>
          <p class="text-align-center" >Create account now !</p>
          <p class="text-align-center" t-text="alertMessage"  style="color:red;" >Opp</p>
          <div>
            <div class="form-group">
              <label class="form-label">Email:</label>
              <input t-model="emailInput" type="email" class="form-input" />
            </div>
            <br/>
            <div class="form-group">
              <label class="form-label">Password:</label>
              <input t-model="passwordInput" type="password" class="form-input" />
            </div>
            <br/>
             <div class="form-group">
              <label class="form-label">Display name:</label>
              <input t-model="nameInput" type="text" class="form-input" />
            </div>
            <br/>
            <div class="form-group">
              <label class="form-label">Username:</label>
              <input t-model="usernameInput" type="text" class="form-input" placeholder="@"/>
            </div>
            <br/>

            <div class="d-flex flex-col align-items-center" style="gap:30px"  >
              <button t-events="click:onRegBtnClick" class="btn btn-primary m-0 py-3 px-5" style="width:98%;">Create account</button>
              <a href="#!/login">Already have an account?</a>
            </div>
          </div>
        </div>
      </div>
    `
  }
})

