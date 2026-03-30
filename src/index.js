import App from './App.js';
import Router from './router.js';

const $root = document.querySelector('#app'); 
const app = new App({ $target: $root });     

const router = Router(app);
router.render();