export const EmptyMessage = Turtle.createComponent({
  isSynchronous:true,
  states:{
    isDisplay:false
  },
  
  onRender(){
    let [forwardRef] = this.props 
    forwardRef.show = ()=> this.states.isDisplay = true
    forwardRef.hide = ()=> this.states.isDisplay = false
  },
  
  template() {
    let [,title,useAddBtn] = this.props
    
    return this.html`
      <div t-visible="isDisplay" class="mt-3 d-flex flex-col justify-content-center align-items-center" style="min-height:50vh; color: #6c757d;">
        <h3 class="mt-3">${title??"No Content"}</h3>
        <p style="max-width: 400px; text-align: center;">
          It seems like there's nothing here yet. Start by adding some content or checking back later.
        </p>
        ${
          useAddBtn 
            ?`
              <button class="btn btn-primary">Add</button>
            `:""
        }
      </div>
    `;
  }
});