import { Container } from './components/Container.js';
import { initRouter } from './router/index.js';
import { initClientAPI } from './apis/index.js';

const app = Turtle.createApp(document.getElementById("root"))
initClientAPI(app)

async function init() {
  app.renderFragment`
    <${Turtle.Lazy(async ()=>{return (await import("./components/Navbar.js")).Navbar})}/>
    <${Container}/>
    <div class="overlay " style="height:100vh;z-index:10000;"  id="overlay">
      <div class="line-loader"/>
    </div>
`

setTimeout(() => initRouter(app), 100)
  

  
}


init()