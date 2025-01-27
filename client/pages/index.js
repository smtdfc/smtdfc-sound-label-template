import {EmptyMessage} from '../components/EmptyMessage.js';


export const Page = Turtle.createComponent({
   onInit:async function() {
    if (!await this.app.authenticated()) {
      this.app.router.redirect("/login", true)
    }
    this.userInfo = this.app.auth.user._info
  },


  onRender() {

  },

  onEditBtnClick(event) {
    event.stopPropagation()
    let id = event.target.dataset.id
    window.location = "#!/details/" + id
  },

  onAnalytisBtnClick(event) {
    event.stopPropagation()
    let id = event.target.dataset.id
    window.location = "#!/analytis/" + id
  },

  addTableItem(data) {
    this.refs.table.appendChild(this.html`
      <tr>
        <td>${data.name}</td>
        <td><a class="link" href="${data.host}">${data.host}</a></td>
        <td>${data.type}</td>
        <td class="d-flex justify-content-center">
          <button t-events="click:onEditBtnClick" data-id="${data.entity_id}" class="btn-icon material-symbols-outlined">edit</button>
          <button t-events="click:onAnalytisBtnClick" data-id="${data.entity_id}" class="btn-icon material-symbols-outlined">monitoring</button>
        </td>
      </tr>
    `)
  },

  template() {
    return this.html`
      <div class="root "  ref="container">
        <h2>Overview</h2>
        <div class=" d-flex align-items-center justify-content-sa" style="overflow-y:hidden;overflow-x:scroll;scroll-snap-type: x mandatory;scroll-padding-left: 20px;" >
          <div class="fade-in-up card text-align-center" style="min-width:200px" >
            <h3 class="d-flex align-items-center justify-content-center" style="gap:10px" ><span class="material-symbols-outlined">bolt</span><span>Released </span></h3>
            <h2>0</h2>
          </div>
          <div class="fade-in-down  card text-align-center" style="min-width:200px">
            <h3 class="d-flex align-items-center justify-content-center" style="gap:10px" ><span class="material-symbols-outlined">stacks</span><span>Review </span></h3>
            <h2>0</h2>
          </div>
          <div class="fade-in-up  card text-align-center" style="min-width:200px">
            <h3 class="d-flex align-items-center justify-content-center" style="gap:10px" ><span class="material-symbols-outlined">schedule</span><span>Scheduled</span></h3>
            <h2>0</h2>
          </div>
        </div>

        <h2>Recent Albums</h2>
        <div class="table-responsive" style="overflow-x:scroll" >
          <table class="table">
            <thead>
              <tr>
                <th style="width:150px">Name</th>
                <th style="width:300px">Artists</th>
                <th style="width:100px">Label</th>
                <th style="width:100px">Status</th>
              </tr>
            </thead>
            <tbody t-ref="table">
            </tbody>
          </table>
        </div>
        <${EmptyMessage(
            {},
            "No album here",
            true
        )}/>
      </div>
    `;
  }
});