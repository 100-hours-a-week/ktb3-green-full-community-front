import App from './App.js';
import { initRouter } from './router/Router.js';

const $root = document.querySelector('#app'); 
const app = new App({ $target: $root });    

const router = initRouter(app);
router.render();