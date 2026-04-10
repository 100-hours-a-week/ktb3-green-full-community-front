import Component from '../../../core/Component.js';
import h from '../../../core/VdomNode.js';
import { getRouter } from '../../../router/Router.js';
import LoginForm from '../components/LoginForm.js';

export default class LoginPage extends Component {

   setup() {
      this._router = getRouter();
      this._bind = false;

      this._routerSignUpPage = () => {
         this._router.navigate('/users/new');
      }
   }

   template() {

      const loginPage = h('div', { class: 'login-page-wrapper' },
         h('div', { class: 'login-title'}, '로그인'),
         h(LoginForm, { componentName: 'login-form' }),
         h('div', { class: 'signup-button' }, '회원가입')
      );

      return loginPage;

   }

   setEvent() {

      if(this._bind) return;
      this._bind = true;

      this.$target.querySelector('.signup-button').addEventListener('click', this._routerSignUpPage);

   }

}