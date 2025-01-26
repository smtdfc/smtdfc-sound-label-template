import {Container} from './components/Container.js';
import {initRouter} from './router/index.js';
const app = Turtle.createApp(document.getElementById("root"))


app.renderFragment`
    <${Turtle.Lazy(async ()=>{return (await import("./components/Navbar.js")).Navbar})}/>
    <${Container}/>
`
setTimeout(()=>{
  initRouter(app)
},0)
