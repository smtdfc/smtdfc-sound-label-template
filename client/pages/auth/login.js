export const Page = Turtle.createComponent({
  onInit: function() {
    this.auth = this.app.auth
  },

  onLoginBtnClick: function(e) {
    
    e.target.disabled = true
    e.preventDefault()
    this.auth.login(
        this.states.emailInput,
        this.states.passwordInput
      )
      
      .then((user) => {
        this.app.router.redirect("/", true)
      })
      .catch((err) => {
        this.states.alertMessage = err.message
      })
      .finally(() => {
        e.target.disabled = false
      })
  },

  template: function() {
    return this.html`
      <div class="root fade container d-flex justify-content-center" style="padding-top:5rem; " ref="container">
        <div class="card p-4 m-0" style="width:350px; height:470px;" >
          <h2 class="text-align-center" >Welcome back !</h2>
          <p class="text-align-center" >Login to continue </p>
          <p class="text-align-center" t-text="alertMessage"  style="color:red;" ></p>
          <form>
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
            <div class="d-flex flex-col align-items-center" style="gap:30px"  >
              <button t-events="click:onLoginBtnClick" class="btn btn-primary m-0 py-3 px-5" style="width:98%;">Login</button>
              <a href="#!/register">Don't have an account?</a>
            </div>
          </form>
        </div>
      </div>
    `
  }
})